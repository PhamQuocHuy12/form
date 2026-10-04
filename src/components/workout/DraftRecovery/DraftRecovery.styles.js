import { css } from "@linaria/core";

export const draftRecovery = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--line-strong);
  border-radius: 9px;
  background: var(--surface-raised);
  & strong {
    font-size: 15px;
    color: var(--text);
  }
  & p {
    margin: 7px 0;
    font-size: 13px;
    color: var(--text-secondary);
  }
  & small {
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-secondary);
  }
`;

export const draftRecoveryActions = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
`;
