import { css } from "@linaria/core";

export const exerciseTrend = css`
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--line-strong);
  border-radius: 9px;
  background: var(--surface-raised);
  @media (max-width: 760px) {
    & {
      padding: 12px;
    }
  }
`;

export const exerciseTrendHeading = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  align-items: baseline;
  & h4 {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  & strong {
    font-size: 20px;
    font-variant-numeric: tabular-nums;
    color: var(--accent);
  }
  .exercise-trend.reps & strong {
    color: var(--chart-reps);
  }
`;

export const exerciseTrendPlot = css`
  width: 100%;
  display: block;
  overflow: visible;
  margin-top: 14px;
  & text {
    fill: var(--text-secondary);
    font-size: 12px;
  }
  @media (max-width: 760px) {
    & text {
      font-size: 18px;
    }
  }
`;

export const trendGridline = css`
  stroke: var(--line-strong);
  stroke-width: 1;
`;

export const trendLine = css`
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linejoin: round;
  .reps & {
    stroke: var(--chart-reps);
  }
`;

export const trendPoint = css`
  fill: var(--surface-raised);
  stroke: var(--accent);
  stroke-width: 2;
  cursor: pointer;
  &.selected {
    fill: var(--accent);
  }
  .trend-point-control:focus-visible & {
    stroke: var(--text);
    stroke-width: 3;
  }
  .reps & {
    stroke: var(--chart-reps);
  }
  .reps &.selected {
    fill: var(--chart-reps);
  }
`;

export const trendPointControl = css`
  &:focus-visible {
    outline: none;
  }
`;

export const bodyweightTrend = css`
  padding: 40px 15px;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.7;
  font-size: 13px;
  & strong {
    display: block;
    color: var(--text);
    font-size: 20px;
    margin-bottom: 8px;
  }
`;
