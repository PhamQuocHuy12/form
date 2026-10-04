import { css } from "@linaria/core";

export const progressColumns = css`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 23px;
  margin: 25px 0;
  @media (max-width: 760px) {
    & {
      grid-template-columns: 1fr;
    }
  }
`;

export const progressView = css`
  min-height: 60vh;
`;
