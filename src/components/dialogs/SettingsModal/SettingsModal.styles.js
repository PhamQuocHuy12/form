import { css } from "@linaria/core";

export const dayOptions = css`
  display: flex;
  gap: 12px;
  & button {
    padding: 20px 8px;
    background: var(--surface-raised);
    border: 1px solid var(--line-strong);
    flex: 1;
    border-radius: 9px;
  }
  & .chosen {
    background: var(--surface-selected);
    border-color: var(--accent);
    color: var(--accent);
  }
  & strong {
    display: block;
    font-size: 27px;
    margin-bottom: 5px;
  }
  & span {
    font-size: 12px;
    color: var(--text-secondary);
  }
  @media (max-width: 760px) {
    & span {
      font-size: 12px;
    }
  }
  & button span {
    line-height: 1.5;
  }
  @media (max-width: 760px) {
    .modal & {
      gap: 8px;
    }
  }
`;

export const weekdayOptions = css`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  & button {
    min-height: 44px;
    padding: 10px 4px;
    background: var(--surface-raised);
    border: 1px solid var(--line-strong);
    border-radius: 8px;
    font-size: 13px;
  }
  & .chosen {
    background: var(--surface-selected);
    border-color: var(--accent);
    color: var(--accent);
  }
`;

export const scheduleCount = css`
  font-size: 12px;
  color: var(--muted);
  margin: 12px 0;
  &.ready {
    color: var(--accent);
  }
`;

export const schedulePreview = css`
  list-style: none;
  margin: 0;
  padding: 0;
  & li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--line);
    font-size: 12px;
  }
  & span {
    color: var(--muted);
  }
`;

export const strategyOptions = css`
  margin-top: 26px;
  & label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px 0;
    cursor: pointer;
  }
  & strong {
    display: block;
    font-size: 15px;
    font-weight: 500;
  }
  & small {
    display: block;
    font-size: 13px;
    line-height: 1.6;
    color: var(--muted);
    margin-top: 4px;
  }
  @media (max-width: 760px) {
    & small {
      font-size: 13px;
    }
  }
`;

export const scheduleOptions = css`
  & .form-hint {
    margin: 0 0 12px;
  }
`;
