import { useSyncExternalStore } from "react";
import { getPwaState, subscribePwa } from "../services/pwa.js";

export function usePwa() {
  return useSyncExternalStore(subscribePwa, getPwaState);
}
