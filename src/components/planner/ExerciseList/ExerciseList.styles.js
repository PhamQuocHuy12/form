import { css } from "@linaria/core";

export const exerciseListToolbar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  & > span {
    color: var(--muted);
    font-size: 12px;
  }
  & .button {
    min-height: 44px;
    font-size: 12px;
  }
`;

export const exerciseList = css`
  margin: 9px 0;
`;

export const exerciseRow = css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 19px 0;
  border-bottom: 1px solid #2e3328;
  &:last-child {
    border: 0;
  }
  @media (min-width: 1500px) {
    & {
      padding: 23px 0;
    }
  }
  @media (max-width: 1250px) {
    & {
      gap: 9px;
    }
  }
  @media (max-width: 760px) {
    & {
      padding: 19px 0;
      gap: 10px;
      flex-wrap: wrap;
      position: relative;
      padding-left: 24px;
    }
  }
  @media (max-width: 1250px) {
    & {
      flex-wrap: wrap;
      padding-left: 24px;
      position: relative;
    }
  }
  @media (min-width: 1251px) {
    & {
      gap: 9px;
    }
  }
`;

export const exerciseNumber = css`
  font-size: 11px;
  color: #727d65;
  width: 15px;
  @media (max-width: 760px) {
    & {
      position: absolute;
      left: 0;
      top: 22px;
    }
  }
  @media (max-width: 1250px) {
    & {
      position: absolute;
      left: 0;
      top: 22px;
    }
  }
`;

export const exerciseSymbol = css`
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border: 1px solid #3c4234;
  border-radius: 8px;
  background: #2a2f24;
  color: #abb698;
  @media (max-width: 1250px) {
    & {
      display: none;
    }
  }
  @media (min-width: 1251px) {
    & {
      width: 34px;
      height: 36px;
    }
  }
`;

export const exerciseInfo = css`
  flex: 1;
  min-width: 0;
  & h3 {
    font-weight: 600;
    line-height: 1.5;
  }
  & > span {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #828e75;
    margin-top: 4px;
  }
  & b {
    font-weight: 400;
    color: #657157;
  }
  @media (max-width: 760px) {
    & {
      flex-basis: calc(100% - 85px);
    }
  }
  & h3 {
    font-size: 14px;
  }
  & > span {
    font-size: 12px;
  }
  @media (max-width: 1250px) {
    & {
      flex-basis: calc(100% - 85px);
    }
  }
  @media (max-width: 760px) {
    & h3 {
      font-size: 15px;
    }
  }
`;

export const exerciseTarget = css`
  text-align: center;
  min-width: 56px;
  & strong {
    display: block;
    font-weight: 500;
  }
  & span {
    color: #849075;
    display: block;
    margin-top: 4px;
  }
  @media (min-width: 1500px) {
    & {
      min-width: 65px;
    }
  }
  @media (max-width: 1020px) {
    & {
      min-width: 45px;
    }
  }
  @media (max-width: 760px) {
    & {
      min-width: 57px;
    }
  }
  &:where(.target-increased) strong {
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 4px;
  }
  & span {
    font-size: 12px;
  }
  & strong {
    font-size: 14px;
  }
  @media (min-width: 1251px) {
    & {
      min-width: 55px;
    }
  }
`;

export const exerciseRest = css`
  text-align: center;
  min-width: 37px;
  & strong {
    display: block;
    font-weight: 500;
  }
  & span {
    color: #849075;
    display: block;
    margin-top: 4px;
  }
  @media (min-width: 1500px) {
    & {
      min-width: 65px;
    }
  }
  @media (max-width: 1020px) {
    & {
      min-width: 30px;
    }
  }
  @media (max-width: 760px) {
    & {
      display: flex;
      gap: 4px;
      align-items: center;
      font-size: 11px;
    }
    & strong {
      font-weight: 400;
      margin: 0;
    }
    & span {
      font-weight: 400;
      margin: 0;
    }
  }
  & span {
    font-size: 12px;
  }
  & strong {
    font-size: 14px;
  }
  @media (max-width: 1250px) {
    & {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 0;
    }
    & span {
      margin: 0;
    }
  }
  @media (min-width: 1251px) {
    & {
      min-width: 35px;
    }
  }
  @media (max-width: 760px) {
    & strong {
      font-size: 12px;
    }
    & span {
      font-size: 12px;
    }
  }
`;

export const weightButton = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 7px 6px;
  min-width: 63px;
  border: 1px dashed #515c3b;
  border-radius: 5px;
  background: transparent;
  color: #bdcb9c;
  @media (max-width: 760px) {
    & {
      margin-left: auto;
      padding: 6px 9px;
    }
  }
  & {
    font-size: 12px;
    min-height: 35px;
  }
  @media (max-width: 1250px) {
    & {
      margin-left: auto;
    }
  }
  @media (max-width: 760px) {
    & {
      font-size: 13px;
      min-height: 40px;
    }
  }
`;
