export type modeType = "light" | "dark";

export type actionType = {
  type: "SET_MODE";
  payload: modeType;
};

export interface RootState {
  mode: modeType;
}
