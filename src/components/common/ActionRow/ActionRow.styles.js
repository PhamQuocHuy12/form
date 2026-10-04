import { css } from "@linaria/core";

export const historyActions = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  & .button {
    min-height: 44px;
    font-size: 12px;
  }
  & {
    margin-top: 20px;
  }
`;
