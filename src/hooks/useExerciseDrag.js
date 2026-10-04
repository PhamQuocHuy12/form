import { useState, useRef, useEffect } from "react";

import { EXERCISES } from "../../shared/catalog/exercises.mjs";

export function useExerciseDrag(ids, setIds, busy) {
  const listRef = useRef(null);
  const gesture = useRef(null);
  const frame = useRef(null);
  const [drag, setDrag] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function preview() {
    const current = gesture.current;
    if (!current?.active || !listRef.current) return;
    const rows = [...listRef.current.children];
    current.targetIndex = rows.filter((row, index) => {
      if (index === current.index) return false;
      const bounds = row.getBoundingClientRect();
      return current.y > bounds.top + bounds.height / 2;
    }).length;
    setDrag({
      id: current.id,
      index: current.index,
      targetIndex: current.targetIndex,
      top: current.y - current.offset,
      left: current.left,
      width: current.width,
    });
  }

  function scroll(timestamp) {
    const current = gesture.current;
    if (!current?.active) return;
    const panel = listRef.current.closest(".modal");
    const bounds = panel.getBoundingClientRect();
    const edge = 56;
    const speed =
      current.y < bounds.top + edge
        ? -Math.min(1, (bounds.top + edge - current.y) / edge)
        : current.y > bounds.bottom - edge
          ? Math.min(1, (current.y - bounds.bottom + edge) / edge)
          : 0;
    const elapsed = Math.min(32, timestamp - (current.timestamp ?? timestamp));
    current.timestamp = timestamp;
    if (speed) {
      panel.scrollTop += speed * elapsed * 0.6;
      preview();
    }
    frame.current = requestAnimationFrame(scroll);
  }

  function finish(commit) {
    const current = gesture.current;
    if (!current) return;
    gesture.current = null;
    cancelAnimationFrame(frame.current);
    setDrag(null);
    if (current.handle.hasPointerCapture(current.pointerId))
      current.handle.releasePointerCapture(current.pointerId);
    if (!current.active) return;
    if (commit) {
      const next = [...current.order];
      next.splice(current.index, 1);
      next.splice(current.targetIndex, 0, current.id);
      setIds(next);
      setAnnouncement(
        `${EXERCISES[current.id].name} moved to position ${current.targetIndex + 1} of ${next.length}.`,
      );
    } else {
      setAnnouncement("Reordering canceled. Exercise order unchanged.");
    }
  }

  function handleProps(id, index) {
    return {
      onPointerDown(e) {
        if (
          busy ||
          ids.length < 2 ||
          !e.isPrimary ||
          e.button !== 0 ||
          gesture.current
        )
          return;
        e.preventDefault();
        const handle = e.currentTarget;
        handle.focus({ preventScroll: true });
        const bounds = handle.closest("li").getBoundingClientRect();
        gesture.current = {
          id,
          index,
          targetIndex: index,
          order: [...ids],
          pointerId: e.pointerId,
          handle,
          startY: e.clientY,
          y: e.clientY,
          offset: e.clientY - bounds.top,
          left: bounds.left,
          width: bounds.width,
          active: false,
        };
        handle.setPointerCapture(e.pointerId);
      },
      onPointerMove(e) {
        const current = gesture.current;
        if (!current || e.pointerId !== current.pointerId) return;
        current.y = e.clientY;
        if (!current.active && Math.abs(current.y - current.startY) >= 6) {
          current.active = true;
          setAnnouncement(
            `Moving ${EXERCISES[id].name}. Release to place it. Escape cancels.`,
          );
          frame.current = requestAnimationFrame(scroll);
        }
        preview();
      },
      onPointerUp(e) {
        if (gesture.current?.pointerId !== e.pointerId) return;
        gesture.current.y = e.clientY;
        preview();
        finish(true);
      },
      onPointerCancel(e) {
        if (gesture.current?.pointerId === e.pointerId) finish(false);
      },
      onLostPointerCapture(e) {
        if (gesture.current?.pointerId === e.pointerId) finish(false);
      },
      onKeyDown(e) {
        if (e.key === "Escape" && gesture.current) {
          e.preventDefault();
          e.stopPropagation();
          finish(false);
        } else if (
          !busy &&
          !gesture.current &&
          ["ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
          const target = index + (e.key === "ArrowUp" ? -1 : 1);
          if (target < 0 || target >= ids.length) return;
          const next = [...ids];
          [next[index], next[target]] = [next[target], next[index]];
          setIds(next);
          setAnnouncement(
            `${EXERCISES[id].name} moved to position ${target + 1} of ${next.length}.`,
          );
        }
      },
    };
  }

  return { listRef, drag, announcement, handleProps };
}
