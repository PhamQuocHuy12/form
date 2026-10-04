import { css } from "@linaria/core";

export const restTimer = css`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #2b3521;
  border: 1px solid #455635;
  border-radius: 9px;
  padding: 8px 13px;
  margin: 18px 0;
  color: #c8daa9;
  position: sticky;
  top: 0;
  z-index: 2;
  & .icon-button {
    flex-shrink: 0;
  }
  & strong {
    font-size: 24px;
    font-variant-numeric: tabular-nums;
  }
  & > span {
    font-size: 12px;
    flex: 1;
  }
  @media (max-width: 760px) {
    & {
      gap: 8px;
      padding: 7px 10px;
    }
    & > span {
      font-size: 11px;
    }
    & strong {
      font-size: 23px;
    }
  }
`;
