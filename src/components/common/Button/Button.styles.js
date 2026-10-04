import { css } from "@linaria/core";

export const button = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 43px;
  border: 0;
  border-radius: 7px;
  padding: 11px 17px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  outline-offset: 4px;
  transition:
    background 0.16s,
    border-color 0.16s,
    transform 0.16s;

  &.primary {
    background: var(--accent);
    color: var(--ink);
    border: 1px solid var(--accent);
  }

  &.secondary {
    background: #20231d;
    color: #d8ddce;
    border: 1px solid #363b2e;
  }

  &.danger {
    background: #68372b;
    color: #ffe9e3;
    border: 1px solid #a25b47;
  }

  &.full-width {
    width: 100%;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
  }

  &:disabled {
    cursor: default;
    opacity: 0.45;
  }
`;
