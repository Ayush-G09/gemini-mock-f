import { modeType } from "../types/redux";

export const setMode = (mode: modeType) => ({
  type: "SET_MODE",
  payload: mode,
});
