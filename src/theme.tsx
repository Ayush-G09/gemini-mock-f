import { DefaultTheme } from "styled-components";
import { modeType } from "./types/redux";

export const generateTheme = (mode: modeType): DefaultTheme => ({
  bg: {
    base100: mode === "light" ? "#FFFFFF" : "#161A1D",
    base200: mode === "light" ? "#F7F8F9" : "#1D2125",
    base300: mode === "light" ? "#F1F2F4" : "#22272B",
  },
  color: {
    text: mode === "light" ? "#000000" : "#FFFFFF",
    blue100: "#388BFF",
    blue200: "#1D7AFC",
    blue300: "#0C66E4",
    gary100: "#d3d3d3",
    gray200: "#a9a9a9",
    red100: "#F87168",
    red200: "#F15B50",
    red300: "#E2483D",
    green100: "#94C748",
    green200: "#82B536",
    green300: "#6A9A23",
  },
});
