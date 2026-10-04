import { css } from "@linaria/core";

export const weekStrip = css`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 29px;
  @media (max-width: 760px) {
    & {
      gap: 5px;
      margin: 0 -2px 23px;
    }
  }
`;

export const dayTile = css`
  text-align: left;
  background: var(--surface-muted);
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 13px 14px 12px;
  position: relative;
  min-width: 0;
  &.selected {
    background: var(--accent);
    color: var(--ink);
    border-color: var(--accent);
  }
  &.rest {
    background: var(--surface-muted);
    border-color: var(--line);
  }
  & > strong {
    font:
      600 27px/1.8 Manrope,
      sans-serif;
    letter-spacing: -1px;
  }
  @media (max-width: 1020px) {
    & {
      padding: 10px;
    }
  }
  @media (max-width: 760px) {
    & {
      border-radius: 8px;
      padding: 9px 4px 8px;
      text-align: center;
    }
    & > strong {
      font-size: 22px;
      line-height: 1.8;
    }
  }
  @media (max-width: 1250px) {
    & {
      padding: 11px 8px;
    }
  }
  &:disabled {
    opacity: 1;
  }
  &.rest {
    color: var(--muted);
  }
`;

export const dayTop = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  .selected & {
    color: var(--ink-muted);
  }
  @media (max-width: 760px) {
    & {
      justify-content: center;
      gap: 3px;
      font-size: 12px;
    }
  }
`;

export const todayDot = css`
  width: 5px;
  height: 5px;
  background: currentColor;
  border-radius: 50%;
`;

export const dayDescription = css`
  font-size: 12px;
  font-weight: 600;
  @media (max-width: 1020px) {
    & {
      font-size: 10px;
    }
  }
  & {
    overflow-wrap: anywhere;
    white-space: normal;
    min-height: 28px;
    display: flex;
    align-items: center;
  }
  @media (max-width: 1250px) {
    & {
      font-size: 11px;
    }
  }
  @media (max-width: 760px) {
    & {
      display: none;
    }
  }
`;

export const dayFooter = css`
  display: flex;
  gap: 5px;
  align-items: center;
  margin-top: 11px;
  color: var(--muted);
  .selected & {
    color: var(--ink-muted);
  }
  @media (max-width: 1020px) {
    & span {
      display: none;
    }
  }
  @media (max-width: 760px) {
    & {
      margin: 5px 0 0;
      justify-content: center;
    }
    & svg {
      width: 12px;
    }
  }
  & {
    font-size: 11px;
  }
  @media (max-width: 1250px) {
    & span {
      display: none;
    }
    & svg {
      width: 14px;
    }
  }
  .rest & {
    color: var(--muted);
  }
`;
