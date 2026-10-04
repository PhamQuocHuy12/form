import { css } from "@linaria/core";

export const logExercise = css`
  border: 1px solid #39442f;
  border-radius: 9px;
  margin: 14px 0;
  overflow: hidden;
  & > summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #242c1e;
  }
  & > summary > span:nth-child(2) {
    flex: 1;
  }
  & summary strong {
    display: block;
    font-size: 15px;
    font-weight: 500;
  }
  & summary small {
    display: block;
    font-size: 12px;
    color: #a4b38f;
    margin-top: 5px;
  }
  @media (max-width: 760px) {
    & summary strong {
      font-size: 14px;
    }
  }
`;

export const logExNumber = css`
  height: 30px;
  width: 30px;
  display: grid;
  place-items: center;
  background: #313d26;
  color: #bbd199;
  border-radius: 6px;
  font-size: 12px;
  &.is-done {
    background: var(--accent);
    color: #243210;
  }
`;

export const logExerciseBody = css`
  padding: 16px;
  @media (max-width: 760px) {
    & {
      padding: 13px;
    }
  }
`;

export const logExerciseTip = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 17px;
  & p {
    flex: 1 1 200px;
    font-size: 13px;
    line-height: 1.6;
    color: #9dab8e;
  }
`;

export const completeExercise = css`
  background: transparent;
  color: #c8df9f;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 13px;
  padding: 12px 0;
  width: 100%;
  font-size: 13px;
`;
