import { css } from "@linaria/core";

export const draftRecovery = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 20px 0;
  padding: 18px;
  border: 1px solid #455635;
  border-radius: 9px;
  background: #252f1e;
  & strong {
    font-size: 15px;
    color: #d6e5bf;
  }
  & p {
    margin: 7px 0;
    font-size: 13px;
    color: #b1c397;
  }
  & small {
    font-size: 12px;
    line-height: 1.5;
    color: #a4b38f;
  }
`;

export const draftRecoveryActions = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
`;
