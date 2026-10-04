import { css } from "@linaria/core";

export const tag = css`
  font:
    500 10px "DM Sans",
    sans-serif;
  letter-spacing: 0;
  color: var(--text-secondary);
  padding: 5px 8px;
  border: 1px solid var(--line-strong);
  border-radius: 5px;
  background: var(--surface-raised);
  @media (max-width: 1250px) {
    .workout-heading h2 & {
      display: none;
    }
  }
  @media (max-width: 760px) {
    .workout-heading h2 & {
      display: none;
    }
  }
`;

export const viewToolbar = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  & h2 {
    font:
      650 25px Manrope,
      sans-serif;
    letter-spacing: -0.6px;
  }
  & h3 {
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  & p {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    margin-top: 8px;
  }
  @media (max-width: 760px) {
    & {
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 17px;
    }
    & h2 {
      font-size: 23px;
    }
  }
`;

export const filterLabel = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  & select {
    width: 160px;
    font-size: 14px;
  }
  @media (max-width: 760px) {
    & select {
      font-size: 14px;
    }
  }
`;

export const emptyState = css`
  padding: 70px 25px;
  text-align: center;
  border: 1px dashed var(--line-strong);
  border-radius: 13px;
  background: var(--surface-muted);
  & > span {
    height: 66px;
    width: 66px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line-strong);
    background: var(--surface-raised);
    color: var(--text);
    border-radius: 18px;
    margin: 0 auto 24px;
  }
  & h3 {
    font:
      600 24px Manrope,
      sans-serif;
  }
  & p {
    color: var(--text-secondary);
    font-size: 15px;
    max-width: 400px;
    margin: 15px auto 25px;
    line-height: 1.8;
  }
  @media (max-width: 760px) {
    & {
      padding: 50px 20px;
    }
    & h3 {
      font-size: 22px;
    }
  }
`;

export const textButton = css`
  color: var(--text);
  background: transparent;
  padding: 15px 0;
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 5px;
`;
