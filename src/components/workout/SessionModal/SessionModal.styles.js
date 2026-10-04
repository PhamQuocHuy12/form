import { css } from "@linaria/core";

export const sessionFields = css`
  margin-bottom: 0;
`;

export const sessionIntro = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  margin: 23px 0 12px;
  & > span:first-child {
    letter-spacing: 1px;
  }
  @media (max-width: 760px) {
    & {
      font-size: 11px;
    }
  }
`;

export const liveDot = css`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  margin-right: 7px;
`;

export const sessionProgress = css`
  height: 5px;
  background: var(--surface-selected);
  border-radius: 3px;
  overflow: hidden;
  & > span {
    height: 100%;
    display: block;
    background: var(--accent);
  }
`;

export const notesLabel = css`
  display: block;
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 23px;
  & textarea {
    margin-top: 10px;
  }
`;

export const saveSession = css`
  border-top: 1px solid var(--line-strong);
  padding-top: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
  & p {
    font-size: 13px;
    line-height: 1.6;
    color: var(--muted);
    max-width: 260px;
  }
  @media (max-width: 760px) {
    & {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    & p {
      max-width: none;
    }
    & .button {
      min-height: 48px;
    }
  }
`;
