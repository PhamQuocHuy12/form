import { css } from "@linaria/core";

export const insightColumn = css`
  display: flex;
  flex-direction: column;
  gap: 18px;
  @media (max-width: 760px) {
    & {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 13px;
    }
  }
`;

export const weeklyCard = css`
  background: #252c1d;
  border: 1px solid #414b2e;
  border-radius: 12px;
  padding: 22px;
  & > p {
    color: #a6b391;
    margin-top: 5px;
  }
  @media (max-width: 1250px) {
    & {
      padding: 19px;
    }
  }
  @media (max-width: 760px) {
    & {
      grid-column: 1/-1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 22px;
    }
    & > p {
      grid-column: 1;
    }
  }
  & > p {
    font-size: 13px;
  }
  & .small-label {
    display: flex;
    justify-content: space-between;
    color: #becea0;
  }
  @media (max-width: 760px) {
    & .small-label {
      grid-column: 1/-1;
    }
  }
  & .small-label {
    font-size: 11px;
  }
`;

export const completionCount = css`
  font:
    700 46px/1.2 Manrope,
    sans-serif;
  color: var(--accent);
  margin-top: 18px;
  letter-spacing: -1px;
  & span {
    font-size: 24px;
    font-weight: 400;
    color: #7e8b69;
    margin-left: 5px;
  }
  @media (max-width: 760px) {
    & {
      margin-top: 14px;
    }
  }
`;

export const progressSegments = css`
  display: flex;
  gap: 7px;
  margin: 20px 0;
  & span {
    flex: 1;
    height: 5px;
    border-radius: 4px;
    background: #414c30;
  }
  & .filled {
    background: var(--accent);
  }
  @media (max-width: 760px) {
    & {
      grid-column: 2;
      grid-row: 2;
      align-self: center;
    }
  }
`;

export const weeklyCardFoot = css`
  border-top: 1px solid #3a452b;
  padding-top: 14px;
  color: #b3c198;
  display: flex;
  gap: 7px;
  align-items: center;
  @media (max-width: 760px) {
    & {
      grid-column: 1/-1;
      margin-top: 18px;
    }
  }
  & {
    font-size: 12px;
  }
  @media (max-width: 760px) {
    & {
      font-size: 12px;
    }
  }
`;

export const balanceCard = css`
  padding: 21px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #1b1e19;
  & h3 {
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & h3 svg {
    color: #909c7c;
  }
  & > p {
    color: #8c977f;
    margin-top: 7px;
  }
  @media (max-width: 1250px) {
    & {
      padding: 19px;
    }
  }
  @media (max-width: 760px) {
    & {
      padding: 17px 13px;
    }
    & h3 svg {
      display: none;
    }
    & > p {
      line-height: 1.6;
    }
  }
  & > p {
    font-size: 12px;
  }
  & h3 {
    font-size: 15px;
  }
  @media (max-width: 760px) {
    & {
      grid-column: 1/-1;
    }
    & > p {
      font-size: 13px;
    }
  }
`;

export const muscleList = css`
  margin-top: 21px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  & > div > span {
    width: 59px;
    color: #abb59d;
  }
  & strong {
    text-align: right;
    font-weight: 500;
    color: #aebc99;
  }
  & small {
    color: #778368;
  }
  @media (max-width: 760px) {
    & {
      gap: 18px;
    }
    & > div {
      gap: 5px;
    }
  }
  & > div > span {
    font-size: 12px;
  }
  & strong {
    font-size: 12px;
  }
  & small {
    font-size: 11px;
  }
  @media (max-width: 760px) {
    & > div > span {
      width: 75px;
      font-size: 13px;
    }
    & strong {
      font-size: 12px;
    }
    & small {
      display: inline;
      font-size: 11px;
    }
  }
  & strong {
    width: 47px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  @media (max-width: 760px) {
    & strong {
      width: 47px;
    }
  }
`;

export const muscleTrack = css`
  flex: 1;
  height: 4px;
  background: #313829;
  border-radius: 3px;
  overflow: hidden;
  & i {
    display: block;
    height: 100%;
    background: #a9be79;
    border-radius: 3px;
  }
  @media (max-width: 760px) {
    & {
      height: 5px;
    }
  }
`;

export const progressionCard = css`
  padding: 23px;
  border: 1px solid #333b29;
  border-radius: 12px;
  background:
    radial-gradient(ellipse at top right, #30391f, transparent 70%), #1d2318;
  & h3 {
    font:
      600 23px/1.35 Manrope,
      sans-serif;
    letter-spacing: -0.5px;
    margin: 9px 0 11px;
  }
  & p {
    color: #95a184;
    line-height: 1.8;
  }
  & button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: transparent;
    color: #c2d696;
    padding: 17px 0 0;
    margin-top: 18px;
    border-top: 1px solid #3a452e;
  }
  @media (max-width: 1250px) {
    & {
      padding: 19px;
    }
  }
  @media (max-width: 760px) {
    & {
      padding: 17px 13px;
    }
    & button {
      gap: 5px;
    }
  }
  & p {
    font-size: 12px;
  }
  & button {
    font-size: 13px;
  }
  @media (max-width: 760px) {
    & {
      grid-column: 1/-1;
    }
    & p {
      font-size: 14px;
    }
    & button {
      font-size: 14px;
    }
    & h3 {
      font-size: 23px;
    }
  }
  & h3 br {
    display: block;
  }
  & .small-label {
    color: #8f9d7b;
  }
  @media (max-width: 760px) {
    & .small-label {
      letter-spacing: 0.9px;
    }
  }
  & .small-label {
    font-size: 11px;
  }
  @media (max-width: 760px) {
    & .small-label {
      font-size: 11px;
    }
  }
`;

export const progressionIcon = css`
  width: 37px;
  height: 37px;
  display: grid;
  place-items: center;
  background: #354024;
  color: #d1e6a0;
  border: 1px solid #475a2c;
  border-radius: 9px;
  margin-bottom: 19px;
  @media (max-width: 760px) {
    & {
      float: right;
      margin-bottom: 0;
    }
  }
`;
