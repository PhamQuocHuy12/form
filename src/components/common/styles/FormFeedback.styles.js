import { css } from "@linaria/core";

export const dangerText = css`
  color: var(--danger-text) !important;
`;

export const formHint = css`
  font-size: 13px !important;
  line-height: 1.7;
  color: var(--muted);
  margin: 18px 0 !important;
  @media (max-width: 760px) {
    & {
      font-size: 13px !important;
    }
  }
`;

export const bright = css`
  color: var(--text);
`;

export const formError = css`
  padding: 12px;
  background: var(--danger-bg);
  border-radius: 6px;
  color: var(--danger-text);
  font-size: 14px;
  line-height: 1.5;
  margin: 14px 0;
`;
