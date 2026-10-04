import { css } from "@linaria/core";

export const nextStepCard = css`
  padding: 25px;
  border: 1px solid #39472c;
  border-radius: 11px;
  & h3 {
    font-size: 18px;
    font-weight: 600;
  }
  & p {
    font-size: 13px;
    color: #9eb18a;
    line-height: 1.7;
    margin-top: 8px;
  }
  & {
    background:
      radial-gradient(ellipse at top right, #354523, transparent 75%), #20291a;
  }
  & > svg {
    color: var(--accent);
    margin-bottom: 17px;
  }
  @media (max-width: 760px) {
    & {
      padding: 20px 16px;
    }
  }
`;

export const suggestionList = css`
  margin-top: 17px;
  & > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #3c4b2d;
    font-size: 12px;
  }
  & strong {
    font-weight: 500;
    color: #c6d8b0;
  }
  & span {
    color: #b9d895;
    white-space: nowrap;
  }
`;
