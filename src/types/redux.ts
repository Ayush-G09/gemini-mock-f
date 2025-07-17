export type modeType = "light" | "dark";

export type actionType =
  | { type: "SET_MODE"; payload: modeType }
  | { type: "ADD_NOTIFICATION"; payload: NotificationType }
  | { type: "DELETE_NOTIFICATION"; payload: Date };

export interface RootState {
  mode: modeType;
}

export type NotificationType = {
  type: "success" | "error";
  title: string;
  msg: string;
  time: Date;
};
