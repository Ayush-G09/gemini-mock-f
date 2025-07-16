import { modeType, actionType } from "../types/redux";

const initialState: { mode: modeType } = {
  mode: "light",
};

const themeReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    default:
      return state;
  }
};

export default themeReducer;
