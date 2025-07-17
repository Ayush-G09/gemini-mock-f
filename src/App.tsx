import { useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { router } from "./routes";
import { generateTheme } from "./theme";
import { RootState } from "./types/redux";
import Notification from "./components/Notification/Index";

function App() {
  const mode = useSelector((state: RootState) => state.mode);
  const currentTheme = generateTheme(mode);
  return (
    <ThemeProvider theme={currentTheme}>
      <Root>
        <Notification />
        <RouterProvider router={router} />
      </Root>
    </ThemeProvider>
  );
}

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(p) => p.theme.bg.base100};
  transition: background-color 0.3s, transform 0.1s;
`;

export default App;
