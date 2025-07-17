import { useState } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function Layout() {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  return (
    <LayoutWrapper>
      <Sidebar open={sidebarOpened} setSidebarOpened={setSidebarOpened} />
      <MainContent>
        <Header onOpenSidebar={() => setSidebarOpened(true)} />
        <ContentBody>
          <Outlet />
        </ContentBody>
      </MainContent>
    </LayoutWrapper>
  );
}

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentBody = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export default Layout;
