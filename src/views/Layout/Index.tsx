import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function Layout() {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <OutletWrapper>
          <Outlet />
        </OutletWrapper>
      </Content>
    </Container>
  );
}

const OutletWrapper = styled.div`
width: 100%;
height: 92%;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  height: 100%;
  disply: flex;
  flex-direction: column;
`;

export default Layout;
