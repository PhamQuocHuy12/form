import { css } from "@linaria/core";

export const statGrid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 25px;
  & > div {
    padding: 25px;
    border: 1px solid var(--line-strong);
    border-radius: 11px;
    background: var(--surface-raised);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  & svg {
    color: var(--text-secondary);
  }
  & strong {
    font:
      600 38px Manrope,
      sans-serif;
    letter-spacing: -1px;
    margin-top: 20px;
  }
  & strong small {
    font-size: 18px;
    color: var(--muted);
    font-weight: 400;
    letter-spacing: 0;
  }
  & > div > span {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 7px;
  }
  @media (max-width: 760px) {
    & {
      gap: 9px;
    }
    & > div {
      padding: 17px 11px;
    }
    & strong {
      font-size: 27px;
      overflow-wrap: anywhere;
      letter-spacing: -1px;
    }
    & strong small {
      font-size: 13px;
      letter-spacing: 0;
    }
    & > div > span {
      font-size: 12px;
      line-height: 1.6;
    }
  }
`;
