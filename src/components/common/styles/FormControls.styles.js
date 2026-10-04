import { css } from "@linaria/core";

export const fieldset = css`
  fieldset:where(&) {
    border: 0;
    padding: 0;
    margin: 0 0 25px;
  }
  & legend {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
  }
`;

export const field = css`
  color: var(--text);
  background: var(--surface-input);
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  padding: 11px 12px;
  width: 100%;
  font-size: 16px;

  &[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: var(--accent);
    margin: 3px 0 0;
    flex-shrink: 0;
  }
  &:where(textarea) {
    resize: vertical;
    line-height: 1.5;
  }
`;
