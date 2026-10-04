import { css } from "@linaria/core";

export const chartCard = css`
  padding: 25px;
  border: 1px solid var(--line-strong);
  background: var(--surface-muted);
  border-radius: 11px;
  & h3 {
    font-size: 18px;
    font-weight: 600;
  }
  & p {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
    margin-top: 8px;
  }
  @media (max-width: 760px) {
    & {
      padding: 20px 16px;
    }
  }
`;

export const barChart = css`
  display: flex;
  justify-content: space-around;
  gap: 15px;
  margin-top: 28px;
  @media (max-width: 760px) {
    & {
      gap: 10px;
    }
  }
`;

export const chartColumn = css`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  & > span {
    font-size: 13px;
    color: var(--text-secondary);
  }
  & small {
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
  }
  @media (max-width: 760px) {
    & small {
      font-size: 11px;
    }
  }
`;

export const chartBarSpace = css`
  height: 135px;
  display: flex;
  align-items: flex-end;
  width: 75%;
  max-width: 38px;
  & i {
    display: block;
    width: 100%;
    border-radius: 5px 5px 0 0;
    background: var(--surface-selected);
  }
  & .current-bar {
    background: var(--accent);
  }
`;
