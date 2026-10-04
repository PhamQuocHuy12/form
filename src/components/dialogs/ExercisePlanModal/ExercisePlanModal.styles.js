import { css } from "@linaria/core";

export const routineEditor = css`
  list-style: none;
  padding: 0;
  margin: 0;
  & li {
    position: relative;
    padding: 12px 0;
    border-bottom: 1px solid var(--line);
  }
  &.is-reordering {
    user-select: none;
  }
  & .drag-origin {
    opacity: 0.35;
  }
  & .drop-before::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 3px;
    background: var(--accent);
    box-shadow: 0 0 10px #e8fc7340;
  }
  & .drop-after::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 3px;
    background: var(--accent);
    box-shadow: 0 0 10px #e8fc7340;
  }
  & .drop-before::before {
    top: -2px;
  }
  & .drop-after::after {
    bottom: -2px;
  }
`;

export const routineGrip = css`
  .routine-choice & {
    min-width: 44px;
    min-height: 48px;
    height: auto;
    flex-shrink: 0;
    gap: 2px;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  & span {
    font-size: 10px;
    color: var(--muted);
  }
  &:active {
    cursor: grabbing;
    color: var(--accent);
  }
  &:disabled {
    cursor: default;
  }
`;

export const routineDragPreview = css`
  position: fixed;
  z-index: 12;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 12px;
  box-sizing: border-box;
  border: 1px solid var(--accent);
  border-radius: 10px;
  background: #29321e;
  box-shadow: 0 10px 30px #0008;
  pointer-events: none;
  & > svg {
    color: var(--accent);
    flex-shrink: 0;
  }
  & strong {
    display: block;
  }
  & small {
    display: block;
  }
  & strong {
    font-size: 14px;
  }
  & small {
    margin-top: 5px;
    color: var(--muted);
    font-size: 12px;
  }
`;

export const routineChoice = css`
  display: flex;
  align-items: center;
  gap: 12px;
  & > span {
    font-size: 12px;
    color: var(--muted);
  }
  & label {
    flex: 1;
    min-width: 0;
  }
  & select {
    font-size: 14px;
    padding: 10px;
    min-height: 44px;
  }
`;

export const routineActions = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
  & small {
    flex: 1;
    color: var(--muted);
    font-size: 12px;
    @media (max-width: 480px) {
      flex-basis: 100%;
    }
  }
  & button {
    min-height: 44px;
    min-width: 44px;
  }
`;

export const routineAdd = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  & label {
    font-size: 13px;
  }
  & select {
    display: block;
    margin-top: 8px;
    font-size: 14px;
  }
  & button {
    align-self: flex-start;
  }
`;
