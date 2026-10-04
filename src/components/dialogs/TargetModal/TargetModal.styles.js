import { css } from "@linaria/core";

export const targetInputs = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1.35fr;
  gap: 14px;
  & label {
    font-size: 14px;
    color: #c7d1b9;
  }
  & input {
    margin-top: 9px;
    min-width: 0;
  }
  @media (max-width: 760px) {
    & {
      gap: 9px;
    }
    & label {
      font-size: 13px;
    }
    & input {
      padding: 11px 8px;
    }
  }
`;

export const suggestionNote = css`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2d3822;
  border: 1px solid #41522f;
  border-radius: 8px;
  padding: 14px;
  font-size: 13px;
  line-height: 1.6;
  color: #c5dba5;
  margin-bottom: 24px;
`;
