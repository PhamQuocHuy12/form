import { css } from "@linaria/core";

export const exerciseYoutubeLink = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 10px;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: #bdcb9c;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  & svg {
    flex-shrink: 0;
  }
  &:hover {
    background: #2a3322;
    color: var(--accent);
  }
`;
