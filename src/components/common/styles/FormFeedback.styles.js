import { css } from "@linaria/core";

export const dangerText = css`
  color: #ffb6a4 !important;
`;

export const formHint = css`
  font-size: 13px !important;
  line-height: 1.7;
  color: #a4ae96;
  margin: 18px 0 !important;
  @media (max-width: 760px) {
    & {
      font-size: 13px !important;
    }
  }
`;

export const bright = css`
  color: #dce5cf;
`;

export const formError = css`
  padding: 12px;
  background: #472c24;
  border-radius: 6px;
  color: #ffd1bb;
  font-size: 14px;
  line-height: 1.5;
  margin: 14px 0;
`;
