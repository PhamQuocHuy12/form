import { css } from "@linaria/core";

export const authPage = css`
  min-height: 100dvh;
  padding: 32px 7vw;
  background:
    radial-gradient(ellipse at 10% 20%, #25301b, transparent 55%), #121412;
  @media (max-width: 760px) {
    & {
      padding: 24px 19px;
    }
    & main {
      padding-bottom: 20px;
    }
  }
`;

export const authBrand = css`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1120px;
  margin: auto;
  & > strong {
    font:
      800 30px Manrope,
      sans-serif;
    letter-spacing: -1.5px;
  }
`;

export const authLayout = css`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 8vw;
  max-width: 1120px;
  min-height: calc(100dvh - 120px);
  padding: 50px 0;
  @media (max-width: 760px) {
    & {
      grid-template-columns: 1fr;
      gap: 27px;
      min-height: 0;
      padding: 38px 0 15px;
    }
  }
`;

export const authIntro = css`
  & h1 {
    font-size: clamp(36px, 4.4vw, 64px);
    line-height: 1.2;
    letter-spacing: -2px;
    margin: 25px 0;
  }
  & > p {
    font-size: 17px;
    color: #aebda0;
    line-height: 1.9;
    max-width: 430px;
    margin-bottom: 35px;
  }
  @media (max-width: 760px) {
    & h1 {
      font-size: 38px;
      margin: 14px 0;
    }
    & h1 br {
      display: block;
    }
    & p {
      font-size: 15px;
      margin-bottom: 0;
    }
  }
`;

export const authBenefit = css`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #d5e3c3;
  margin: 18px 0;
  & svg {
    color: var(--accent);
  }
  @media (max-width: 760px) {
    & {
      display: none;
    }
  }
`;

export const authCard = css`
  border: 1px solid #414d32;
  border-radius: 16px;
  padding: 34px;
  background: #1d2519;
  box-shadow: 0 25px 80px #0004;
  & h2 {
    font:
      700 27px Manrope,
      sans-serif;
    letter-spacing: -0.7px;
  }
  & > p {
    color: #a4b691;
    font-size: 14px;
    line-height: 1.8;
    margin: 12px 0 28px;
  }
  & label {
    display: block;
    font-size: 14px;
    color: #c9d8b9;
    margin: 19px 0;
  }
  & input {
    margin-top: 9px;
    min-height: 48px;
  }
  & .primary {
    min-height: 48px;
    margin-top: 12px;
  }
  @media (max-width: 760px) {
    & {
      padding: 25px 22px;
    }
    & h2 {
      font-size: 25px;
    }
  }
`;

export const authLock = css`
  display: grid;
  place-items: center;
  background: #344126;
  border: 1px solid #52653b;
  border-radius: 11px;
  width: 46px;
  height: 46px;
  color: var(--accent);
  margin-bottom: 24px;
  @media (max-width: 760px) {
    & {
      width: 39px;
      height: 39px;
      margin-bottom: 20px;
    }
  }
`;

export const authTextButton = css`
  background: transparent;
  color: #cbdfab;
  font-size: 13px;
  padding: 0;
  display: block;
  margin: 0 0 22px auto;
`;

export const authSwitch = css`
  border-top: 1px solid #3e4d30;
  text-align: center;
  padding-top: 24px;
  margin-top: 25px;
  color: #aabd96;
  font-size: 14px;
  line-height: 1.7;
  & button {
    background: transparent;
    color: var(--accent);
    padding: 5px;
    font-size: 14px;
  }
`;

export const authMessage = css`
  background: #2c3c21;
  border: 1px solid #4f6839;
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #d3e8b9;
  line-height: 1.7;
  padding: 14px;
`;
