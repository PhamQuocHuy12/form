import { css } from "@linaria/core";

export const modalBackdrop = css`
  position: fixed;
  inset: 0;
  background: var(--backdrop);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 24px;
  @media (max-width: 760px) {
    & {
      padding: 15px;
    }
    &:has(.wide-modal) {
      padding: 0;
      align-items: flex-end;
    }
  }
`;

export const modal = css`
  width: 100%;
  max-width: 500px;
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  background: var(--surface-muted);
  padding: 26px;
  box-shadow: 0 25px 100px var(--shadow-modal);
  max-height: 90dvh;
  overflow-y: auto;
  & > p {
    font-size: 14px;
    color: var(--muted);
    margin: 10px 0 24px;
    line-height: 1.6;
  }
  @media (max-width: 760px) {
    & {
      padding: 21px;
    }
  }
  &:where(.wide-modal) {
    max-width: 660px;
  }
  @media (max-width: 760px) {
    &:where(.wide-modal) {
      border-radius: 17px 17px 0 0;
      padding: 22px 17px max(24px, env(safe-area-inset-bottom));
    }
    & {
      max-height: 93dvh;
    }
  }
`;

export const modalHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  & h2 {
    font:
      700 24px Manrope,
      sans-serif;
  }
  @media (max-width: 760px) {
    & h2 {
      font-size: 22px;
    }
  }
`;
