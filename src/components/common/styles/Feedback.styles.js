import { css } from "@linaria/core";

export const errorBanner = css`
  padding: 14px;
  background: #422a24;
  color: #ffcec0;
  border: 1px solid #88513e;
  border-radius: 8px;
  margin-bottom: 20px;
  & button {
    background: transparent;
    text-decoration: underline;
    margin-left: 10px;
  }
`;

export const loading = css`
  padding: 60px;
  color: var(--muted);
  text-align: center;
`;

export const toast = css`
  position: fixed;
  bottom: 24px;
  left: calc(50% + 100px);
  transform: translateX(-50%);
  padding: 15px 22px;
  border: 1px solid #7b9251;
  background: #2e3b20;
  box-shadow: 0 8px 30px #0008;
  border-radius: 9px;
  color: #e3f5c6;
  font-size: 14px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 90vw;
  @media (max-width: 760px) {
    & {
      left: 50%;
      bottom: 88px;
      width: max-content;
      font-size: 13px;
      line-height: 1.6;
    }
  }
`;
