import { css } from "@linaria/core";

export const setGrid = css`
  display: grid;
  grid-template-columns: 35px 1fr 1fr 45px;
  align-items: center;
  gap: 13px;
  margin: 9px 0;
  text-align: center;
  & > span {
    font-size: 14px;
    color: #a6b98f;
  }
  & input {
    text-align: center;
    min-width: 0;
  }
  &:where(.set-labels) span {
    font-size: 11px;
    letter-spacing: 1px;
  }
  &:where(.set-done) input[type="number"] {
    border-color: #6b8543;
    background: #27351b;
  }
  @media (max-width: 760px) {
    & {
      gap: 10px;
      grid-template-columns: 25px 1fr 1fr 40px;
    }
    & input {
      padding: 10px 6px;
    }
  }
`;

export const setCheck = css`
  position: relative;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  cursor: pointer;
  & input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
  }
  & span {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 1px solid #4a593a;
    border-radius: 6px;
    color: transparent;
    background: #232d1a;
  }
  & input:checked + span {
    background: var(--accent);
    border-color: var(--accent);
    color: #23310f;
  }
  & input:focus-visible + span {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
`;
