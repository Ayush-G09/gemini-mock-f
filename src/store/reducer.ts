import { modeType, actionType, NotificationType } from "../types/redux";

const initialState: {
  mode: modeType;
  notifications: NotificationType[];
} = {
  mode: "light",
  notifications: [],
};

const themeReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) =>
            new Date(notification.time).getTime() !==
            new Date(action.payload).getTime()
        ),
      };
    default:
      return state;
  }
};

export default themeReducer;
