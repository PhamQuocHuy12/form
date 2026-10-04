import { css } from "@linaria/core";

export const smallLabel = css`
  letter-spacing: 1.4px;
  font-weight: 700;
  color: var(--text-secondary);
  font-size: 11px;
`;

export const eyebrow = css`
  font-weight: 700;
  letter-spacing: 1.8px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  & span {
    width: 14px;
    height: 2px;
    background: var(--accent);
  }
  @media (max-width: 760px) {
    & {
      letter-spacing: 1.1px;
    }
  }
  & {
    font-size: 11px;
  }
`;

export const pageTitle = css`
  h1:where(&) {
    font:
      750 clamp(28px, 2.7vw, 40px)/1.15 Manrope,
      sans-serif;
    letter-spacing: -1.4px;
  }
  @media (max-width: 760px) {
    h1:where(&) {
      font-size: 30px;
      letter-spacing: -1px;
    }
  }
`;
