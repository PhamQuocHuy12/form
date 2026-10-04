import { css } from "@linaria/core";

export const exerciseProgressCard = css`
  padding: 25px;
  margin: 25px 0;
  border: 1px solid var(--line-strong);
  background: var(--surface-muted);
  border-radius: 11px;
  min-width: 0;
  @media (max-width: 760px) {
    & {
      padding: 18px;
    }
  }
`;

export const exerciseProgressToolbar = css`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: flex-end;
  justify-content: space-between;
  & > div:first-child {
    flex: 1 1 250px;
  }
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
`;

export const exerciseProgressControls = css`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: flex-end;
  justify-content: space-between;
  flex: 1 1 360px;
  & label {
    min-width: 0;
    flex: 1 1 150px;
    font-size: 12px;
    color: var(--text-secondary);
  }
  & label:first-child {
    flex-basis: 220px;
  }
  & select {
    width: 100%;
    margin-top: 7px;
    min-width: 0;
  }
  @media (max-width: 760px) {
    & {
      flex-basis: 100%;
      gap: 12px;
    }
    & label {
      flex-basis: 100%;
    }
    & label:first-child {
      flex-basis: 100%;
    }
  }
`;

export const exerciseProgressPeriod = css`
  font-size: 13px;
  color: var(--muted);
  line-height: 1.7;
  margin-top: 8px;
  margin: 16px 0;
`;
