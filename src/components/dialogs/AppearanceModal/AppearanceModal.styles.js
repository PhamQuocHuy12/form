import { css } from "@linaria/core";

export const themeOptions = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  & label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px 8px;
    border: 1px solid var(--line);
    border-radius: 9px;
    background: var(--panel);
    cursor: pointer;
  }
  & label:has(input:checked) {
    border-color: var(--accent);
    background: var(--surface-selected);
  }
  & input {
    accent-color: var(--accent);
    margin: 0;
  }
  & span {
    width: 100%;
    text-align: center;
    font-weight: 600;
  }
`;
