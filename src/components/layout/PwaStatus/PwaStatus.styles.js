import { css } from "@linaria/core";

export const status = css`
  position: relative;
  z-index: 6;
  padding: 12px max(20px, env(safe-area-inset-left));
  border-bottom: 1px solid var(--line-strong);
  background: var(--panel);
  color: var(--text);
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  & p + p {
    margin-top: 6px;
  }
`;
