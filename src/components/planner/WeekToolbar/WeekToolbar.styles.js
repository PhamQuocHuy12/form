import { css } from "@linaria/core";

export const weekToolbar = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 19px;
  gap: 12px;
`;

export const weekTitle = css`
  display: flex;
  align-items: center;
  gap: 13px;
  & strong {
    display: block;
    font-size: 16px;
    font-weight: 600;
  }
  & span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
  }
  @media (max-width: 760px) {
    & {
      gap: 10px;
    }
    & strong {
      font-size: 15px;
    }
    & span {
      font-size: 11px;
    }
  }
`;

export const weekIcon = css`
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  background: #25291f;
  border: 1px solid #353b2a;
  border-radius: 8px;
  color: #b2bca3;
  @media (max-width: 760px) {
    & {
      display: none;
    }
  }
`;

export const weekControls = css`
  display: flex;
  gap: 5px;
  & button {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 6px;
    height: 32px;
    display: grid;
    place-items: center;
  }
  @media (max-width: 760px) {
    & {
      gap: 4px;
    }
    & button {
      height: 33px;
    }
  }
  & button {
    min-width: 36px;
    min-height: 36px;
  }
`;

export const todayButton = css`
  .week-controls & {
    padding: 0 13px;
    font-size: 12px;
    color: #bdc4b3;
  }
  @media (max-width: 760px) {
    .week-controls & {
      font-size: 11px;
      padding: 0 8px;
    }
  }
`;
