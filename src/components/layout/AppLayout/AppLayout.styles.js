import { css } from "@linaria/core";

export const topbarRight = css`
  display: flex;
  align-items: center;
  gap: 23px;
  @media (max-width: 760px) {
    & {
      gap: 12px;
    }
  }
`;

export const todayLabel = css`
  @media (max-width: 760px) {
    .topbar:has(.signout-button) & {
      display: none;
    }
  }
  & {
    font-size: 13px;
    color: var(--muted);
  }
  @media (max-width: 760px) {
    & {
      font-size: 11px;
    }
  }
`;

export const appShell = css`
  min-height: 100vh;
`;

export const sidebar = css`
  width: 228px;
  position: fixed;
  inset: 0 auto 0 0;
  border-right: 1px solid var(--line);
  background: #161815;
  display: flex;
  flex-direction: column;
  padding: 35px 20px;
  @media (max-width: 1250px) {
    & {
      width: 202px;
      padding: 28px 14px;
    }
  }
  @media (max-width: 1020px) {
    & {
      width: 80px;
      padding: 28px 14px;
    }
    & nav {
      margin-top: 45px;
    }
  }
  @media (max-width: 760px) {
    & {
      inset: auto 0 0;
      width: 100%;
      height: 72px;
      padding: 5px 15px max(5px, env(safe-area-inset-bottom));
      z-index: 5;
      border-right: 0;
      border-top: 1px solid #3b432e;
      background: #181d15f5;
      backdrop-filter: blur(12px);
    }
    & nav {
      display: flex;
      justify-content: space-around;
      margin: 0;
    }
  }
  @media (max-width: 1020px) {
    & .brand {
      font-size: 0;
      gap: 0;
      justify-content: center;
    }
  }
  @media (max-width: 760px) {
    & > .brand {
      display: none;
    }
  }
  @media (max-width: 1020px) {
    & .brand-dot {
      display: none;
    }
  }
`;

export const workspaceLabel = css`
  letter-spacing: 1.6px;
  color: #767d6e;
  margin: 57px 13px 18px;
  font-weight: 700;
  @media (max-width: 1020px) {
    & {
      display: none;
    }
  }
  & {
    font-size: 11px;
  }
`;

export const navItem = css`
  background: transparent;
  display: flex;
  align-items: center;
  text-align: left;
  width: 100%;
  gap: 12px;
  padding: 14px 13px;
  border-radius: 7px;
  color: #a6ac9e;
  font-size: 14px;
  margin: 5px 0;
  &.active {
    background: #2a3020;
    color: var(--accent);
  }
  @media (max-width: 1020px) {
    & span {
      display: none;
    }
    & {
      justify-content: center;
      padding: 16px;
    }
  }
  @media (max-width: 760px) {
    & {
      margin: 0;
      padding: 8px 10px;
      flex-direction: column;
      gap: 5px;
      width: 110px;
      border-radius: 8px;
    }
    & span {
      display: block;
    }
    &.active {
      background: transparent;
    }
  }
  & {
    min-height: 47px;
  }
  @media (max-width: 760px) {
    & span {
      font-size: 11px;
    }
  }
`;

export const navIndicator = css`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  margin-left: auto;
  @media (max-width: 760px) {
    .nav-item & {
      display: none;
    }
  }
`;

export const sidebarBottom = css`
  margin-top: auto;
  padding: 75px 13px 0;
  & p {
    font:
      600 18px/1.5 Manrope,
      sans-serif;
    margin-top: 13px;
    color: #c6cbbd;
  }
  @media (max-width: 1020px) {
    & {
      display: none;
    }
  }
`;

export const miniBars = css`
  height: 63px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin: 23px 0 26px;
  & i {
    width: 13px;
    background: #363e25;
    border-radius: 2px 2px 0 0;
  }
  & i:last-child {
    background: var(--accent);
  }
`;

export const localLabel = css`
  padding-top: 21px;
  border-top: 1px solid var(--line);
  color: #969e89;
  display: flex;
  align-items: center;
  gap: 7px;
  & span {
    width: 5px;
    height: 5px;
    background: #adba89;
    border-radius: 50%;
  }
  & {
    font-size: 12px;
  }
`;

export const mainShell = css`
  margin-left: 228px;
  @media (max-width: 1250px) {
    & {
      margin-left: 202px;
    }
  }
  @media (max-width: 1020px) {
    & {
      margin-left: 80px;
    }
  }
  @media (max-width: 760px) {
    & {
      margin-left: 0;
    }
  }
`;

export const topbar = css`
  height: 81px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 42px;
  @media (max-width: 1250px) {
    & {
      padding: 0 26px;
    }
  }
  @media (max-width: 760px) {
    & {
      height: 70px;
      padding: 0 20px;
    }
  }
`;

export const desktopBreadcrumb = css`
  display: flex;
  gap: 13px;
  align-items: center;
  font-size: 13px;
  color: #777f70;
  & strong {
    color: #bcc2b4;
    font-weight: 500;
  }
  @media (max-width: 760px) {
    & {
      display: none;
    }
  }
`;

export const avatar = css`
  display: grid;
  place-items: center;
  border: 1px solid #474d3b;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  background: #272d1e;
  color: #d3dec0;
  font-size: 10px;
  font-weight: 700;
  @media (max-width: 760px) {
    & {
      height: 30px;
      width: 30px;
      font-size: 9px;
    }
  }
`;

export const mobileBrand = css`
  display: none;
  @media (max-width: 760px) {
    & {
      display: block;
    }
    & .brand {
      font-size: 24px;
    }
  }
`;

export const mainContent = css`
  main:where(&) {
    max-width: 1500px;
    margin: auto;
    padding: 39px 42px 18px;
  }
  @media (max-width: 1250px) {
    main:where(&) {
      padding: 30px 26px 18px;
    }
  }
  @media (max-width: 760px) {
    main:where(&) {
      padding: 28px 18px 100px;
    }
  }
`;

export const pageFooter = css`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: 9px;
  color: #6d7960;
  margin-top: 32px;
  & span:first-child {
    letter-spacing: 1.1px;
  }
  @media (max-width: 760px) {
    & {
      line-height: 1.6;
      margin-top: 27px;
    }
    & span:last-child {
      display: none;
    }
    & {
      font-size: 11px;
    }
  }
`;
