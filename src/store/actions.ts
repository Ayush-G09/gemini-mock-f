import { modeType, NotificationType } from "../types/redux";

export const setMode = (mode: modeType) => ({
  type: "SET_MODE",
  payload: mode,
});

export const addNotification = (notification: NotificationType) => ({
  type: "ADD_NOTIFICATION",
  payload: notification,
});

export const deleteNotification = (time: Date) => ({
  type: "DELETE_NOTIFICATION",
  payload: time,
});
