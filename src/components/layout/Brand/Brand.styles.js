import { css } from "@linaria/core";

export const brand = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: Manrope, sans-serif;
  font-size: 29px;
  font-weight: 800;
  letter-spacing: -1.5px;
`;

export const brandMark = css`
  height: 37px;
  width: 37px;
  background: var(--accent);
  color: var(--ink);
  display: grid;
  place-items: center;
  border-radius: 9px;
  @media (max-width: 760px) {
    & {
      height: 30px;
      width: 30px;
      border-radius: 7px;
    }
    & svg {
      width: 19px;
    }
  }
`;

export const brandDot = css`
  font-size: 12px;
  align-self: flex-start;
  padding-top: 3px;
  letter-spacing: 0;
`;
