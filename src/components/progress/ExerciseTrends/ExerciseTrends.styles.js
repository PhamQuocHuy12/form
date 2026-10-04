import { css } from "@linaria/core";

export const singleProgressHint = css`
  font-size: 13px;
  color: #9eb18a;
  line-height: 1.7;
  margin-top: 8px;
`;

export const exerciseTrendGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  @media (max-width: 760px) {
    & {
      grid-template-columns: 1fr;
    }
  }
`;

export const exerciseTrendSelection = css`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 18px;
  padding: 16px 0;
  font-size: 12px;
  line-height: 1.7;
  color: #a4b38f;
  & strong {
    color: #d6edab;
    font-size: 15px;
    font-variant-numeric: tabular-nums;
  }
`;

export const emptyExerciseProgress = css`
  padding: 40px 15px;
  color: #a4b38f;
  text-align: center;
  line-height: 1.7;
  font-size: 13px;
  border: 1px dashed #455635;
  border-radius: 9px;
`;

export const exerciseProgressData = css`
  border-top: 1px solid #39472c;
  & summary {
    padding: 14px 0;
    font-size: 13px;
    color: #d5eca9;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  & table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    text-align: left;
  }
  & th {
    padding: 12px 10px;
    border-top: 1px solid #39472c;
    line-height: 1.6;
  }
  & td {
    padding: 12px 10px;
    border-top: 1px solid #39472c;
    line-height: 1.6;
  }
  & th {
    color: #b7c6a4;
    font-weight: 500;
  }
  & td {
    color: #d6e5bf;
  }
`;

export const exerciseProgressTableWrap = css`
  overflow-x: auto;
`;
