import { css } from "@linaria/core";

export const historyList = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const historyItem = css`
  border: 1px solid #38452d;
  border-radius: 11px;
  background: #1b2217;
  & summary {
    padding: 23px;
    display: flex;
    align-items: center;
    gap: 18px;
  }
  @media (max-width: 760px) {
    & summary {
      padding: 17px 14px;
      gap: 10px;
      flex-wrap: wrap;
    }
  }
`;

export const historyIcon = css`
  width: 43px;
  height: 43px;
  border: 1px solid #4c5b3c;
  border-radius: 10px;
  background: #2b3622;
  color: #bfd6a0;
  display: grid;
  place-items: center;
  @media (max-width: 760px) {
    & {
      width: 36px;
      height: 36px;
    }
  }
`;

export const historyTitle = css`
  flex: 1;
  min-width: 0;
  & strong {
    font-size: 17px;
    font-weight: 600;
    display: block;
  }
  & small {
    font-size: 12px;
    line-height: 1.6;
    display: block;
    color: #94a780;
    margin-top: 6px;
  }
  @media (max-width: 760px) {
    & strong {
      font-size: 16px;
    }
    & small {
      font-size: 12px;
    }
  }
`;

export const statusTag = css`
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
  background: #304322;
  border: 1px solid #4d623c;
  color: #bddb9e;
  padding: 6px 9px;
  font-size: 12px;
  &.partial {
    color: #ddc397;
    background: #3a3121;
    border-color: #5d4a2b;
  }
  @media (max-width: 760px) {
    & {
      margin-left: 46px;
    }
  }
`;

export const historyDetails = css`
  padding: 0 24px 24px;
  @media (max-width: 760px) {
    & {
      padding: 0 15px 20px;
    }
  }
`;

export const historyStats = css`
  display: flex;
  gap: 24px;
  padding: 17px 0;
  border-top: 1px solid #3a482e;
  color: #9bab8a;
  font-size: 13px;
  & strong {
    font-size: 18px;
    color: #d6e7c4;
    margin-right: 5px;
  }
  @media (max-width: 760px) {
    & {
      gap: 18px;
      flex-wrap: wrap;
    }
  }
`;

export const historyExercise = css`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid #313d27;
  align-items: center;
  & > strong {
    font-size: 14px;
    font-weight: 500;
  }
  & > span {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: flex-end;
  }
  & small {
    font-size: 12px;
    background: #2b3720;
    color: #b8cda2;
    border-radius: 4px;
    padding: 5px 7px;
  }
  @media (max-width: 760px) {
    & {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    & > span {
      justify-content: flex-start;
    }
  }
`;

export const savedNotes = css`
  background: #26311e;
  padding: 16px;
  border-radius: 8px;
  margin-top: 15px;
  & > span {
    font-size: 11px;
    letter-spacing: 1px;
    color: #a4b78d;
  }
  & > p {
    font-size: 14px;
    line-height: 1.8;
    margin-top: 10px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

export const historyView = css`
  min-height: 60vh;
`;
