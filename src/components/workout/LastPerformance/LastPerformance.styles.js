import { css } from "@linaria/core";

export const lastPerformance = css`
  margin-bottom: 17px;
  padding: 12px;
  border: 1px solid var(--line-strong);
  border-radius: 7px;
  background: var(--surface-raised);
  & > p {
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-secondary);
    margin: 6px 0 0;
  }
`;

export const lastPerformanceHeading = css`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 5px 12px;
  & > strong {
    font-size: 13px;
    color: var(--text-secondary);
  }
  & > span {
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-secondary);
  }
`;

export const lastPerformanceSets = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  & li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 8px;
    padding: 6px 9px;
    border-radius: 5px;
    background: var(--surface-raised);
    font-size: 12px;
    line-height: 1.5;
  }
  & li > span {
    color: var(--text-secondary);
  }
  & li > strong {
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
`;
