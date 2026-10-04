import { css } from "@linaria/core";

export const contentGrid = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  @media (min-width: 1500px) {
    & {
      grid-template-columns: minmax(0, 1fr) 310px;
    }
  }
  @media (max-width: 1250px) {
    & {
      grid-template-columns: minmax(0, 1fr) 240px;
      gap: 18px;
    }
  }
  @media (max-width: 1020px) {
    & {
      grid-template-columns: minmax(0, 1fr) 245px;
    }
  }
  @media (max-width: 760px) {
    & {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
`;
