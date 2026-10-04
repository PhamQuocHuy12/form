import { css } from "@linaria/core";

export const recordsCard = css`
  padding: 25px;
  border: 1px solid #39472c;
  background: #1c2318;
  border-radius: 11px;
  @media (max-width: 760px) {
    & {
      padding: 20px 16px;
    }
  }
`;

export const recordGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 30px;
  @media (max-width: 760px) {
    & {
      grid-template-columns: 1fr;
    }
  }
`;

export const record = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-top: 1px solid #36452a;
  padding: 20px 0;
  & > span:first-child {
    min-width: 0;
  }
  & strong {
    font-size: 14px;
    font-weight: 500;
    display: block;
  }
  & small {
    display: block;
    font-size: 12px;
    color: #95a780;
    margin-top: 5px;
  }
`;

export const recordValue = css`
  font-size: 24px;
  font-weight: 600;
  color: #d6edab;
  white-space: nowrap;
  & small {
    display: inline;
    font-size: 13px;
    font-weight: 400;
  }
`;

export const emptyRecords = css`
  padding: 25px 0;
  font-size: 14px;
  color: #a1b38b;
`;
