import { css } from "@linaria/core";

export const workoutPanel = css`
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  overflow: hidden;
  padding: 25px 23px 19px;
  align-self: start;
  @media (max-width: 1250px) {
    & {
      padding: 21px 17px;
    }
  }
  @media (max-width: 760px) {
    & {
      padding: 20px 15px 16px;
    }
  }
  @media (min-width: 1251px) {
    & {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
`;

export const sectionKicker = css`
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--muted);
  margin-bottom: 12px;
  font-size: 11px;
`;

export const workoutHeading = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 23px;
  gap: 10px;
  & h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font:
      700 24px/1.3 Manrope,
      sans-serif;
    letter-spacing: -0.7px;
  }
  & p {
    color: var(--muted);
    font-size: 13px;
    margin-top: 7px;
  }
  @media (max-width: 1250px) {
    & h2 {
      font-size: 21px;
    }
  }
  @media (max-width: 760px) {
    & h2 {
      font-size: 24px;
    }
    & p {
      font-size: 12px;
    }
    & {
      align-items: flex-start;
    }
  }
`;

export const workoutDuration = css`
  font-size: 12px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  @media (max-width: 1250px) {
    & {
      font-size: 11px;
    }
  }
  @media (max-width: 1020px) {
    & {
      display: none;
    }
  }
  @media (max-width: 760px) {
    & {
      display: none;
    }
  }
`;

export const sessionStrip = css`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-raised);
  color: var(--text-secondary);
  & strong {
    font-weight: 600;
    color: var(--text);
  }
  & strong span {
    color: var(--muted);
    font-weight: 400;
  }
  & p {
    line-height: 1.6;
    color: var(--muted);
    margin-top: 4px;
  }
  &:where(.cooldown) {
    background: var(--surface-raised);
    border-color: var(--line);
    color: var(--muted);
  }
  &:where(.cooldown) strong {
    color: var(--text-secondary);
  }
  &:where(.cooldown) p {
    color: var(--muted);
  }
  @media (max-width: 760px) {
    & {
      padding: 13px 12px;
      gap: 10px;
    }
    & p {
      line-height: 1.7;
    }
  }
  & p {
    font-size: 12px;
  }
  & strong span {
    font-size: 12px;
  }
  & strong {
    font-size: 14px;
  }
  & > div {
    flex: 1;
  }
  @media (max-width: 760px) {
    & p {
      font-size: 12px;
    }
    & strong {
      font-size: 14px;
    }
    & strong span {
      font-size: 12px;
    }
  }
`;

export const workoutBottom = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
  gap: 12px;
  & > span {
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 7px;
  }
  @media (max-width: 1250px) {
    & > span {
      max-width: 140px;
    }
  }
  @media (max-width: 1020px) {
    & > span {
      display: none;
    }
    & .button {
      width: 100%;
    }
  }
  @media (max-width: 760px) {
    & {
      margin-top: 18px;
    }
    & .button {
      min-height: 48px;
      font-size: 15px;
    }
  }
  & > span {
    font-size: 12px;
  }
  @media (max-width: 760px) {
    & .button {
      display: none;
    }
    & {
      display: none;
    }
  }
`;

export const sessionRecommendation = css`
  & > summary > svg:last-child {
    margin-left: auto;
  }
  &[open] > summary > svg:last-child {
    transform: rotate(45deg);
  }
`;

export const recommendationContent = css`
  font-size: 14px;
  line-height: 1.7;
  padding: 8px 16px;
  color: var(--text-secondary);
  & ol {
    padding-left: 17px;
  }
  & li {
    padding: 3px 0;
  }
`;

export const mobileSessionButton = css`
  display: none;
  @media (max-width: 760px) {
    & {
      display: inline-flex;
      min-height: 42px;
      padding: 10px 12px;
      font-size: 13px;
    }
  }
`;
