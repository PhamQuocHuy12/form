import { css } from "@linaria/core";

export const pageHeading = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
  & p {
    color: var(--muted);
    font-size: 14px;
    margin-top: 11px;
  }
  @media (max-width: 1020px) {
    & .button {
      font-size: 12px;
    }
  }
  @media (max-width: 760px) {
    & {
      align-items: flex-start;
      margin-bottom: 29px;
    }
    & p {
      max-width: 240px;
      line-height: 1.6;
    }
    & > .button {
      font-size: 0;
      min-width: 40px;
      width: 40px;
      height: 40px;
      padding: 0;
      margin-top: 22px;
    }
    & > .button svg {
      width: 18px;
    }
    & p {
      font-size: 14px;
    }
  }
`;
