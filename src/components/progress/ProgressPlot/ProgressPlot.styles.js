import { css } from "@linaria/core";

export const exerciseTrend = css`
  min-width: 0;
  padding: 16px;
  border: 1px solid #39472c;
  border-radius: 9px;
  background: #20291b;
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
    color: #b7c6a4;
    font-weight: 500;
  }
  & strong {
    font-size: 20px;
    font-variant-numeric: tabular-nums;
    color: var(--accent);
  }
  .exercise-trend.reps & strong {
    color: #b0dce7;
  }
`;

export const exerciseTrendPlot = css`
  width: 100%;
  display: block;
  overflow: visible;
  margin-top: 14px;
  & text {
    fill: #a4b38f;
    font-size: 12px;
  }
  @media (max-width: 760px) {
    & text {
      font-size: 18px;
    }
  }
`;

export const trendGridline = css`
  stroke: #3b4830;
  stroke-width: 1;
`;

export const trendLine = css`
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linejoin: round;
  .reps & {
    stroke: #b0dce7;
  }
`;

export const trendPoint = css`
  fill: #20291b;
  stroke: var(--accent);
  stroke-width: 2;
  cursor: pointer;
  &.selected {
    fill: var(--accent);
  }
  .trend-point-control:focus-visible & {
    stroke: #ffffff;
    stroke-width: 3;
  }
  .reps & {
    stroke: #b0dce7;
  }
  .reps &.selected {
    fill: #b0dce7;
  }
`;

export const trendPointControl = css`
  &:focus-visible {
    outline: none;
  }
`;

export const bodyweightTrend = css`
  padding: 40px 15px;
  color: #a4b38f;
  text-align: center;
  line-height: 1.7;
  font-size: 13px;
  & strong {
    display: block;
    color: #d6edab;
    font-size: 20px;
    margin-bottom: 8px;
  }
`;
