import {
  faBars,
  faMagnifyingGlass,
  faMoon,
  faPenToSquare,
  faSun,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { addNotification, setMode } from "../../../store/actions";
import { NotificationType, RootState } from "../../../types/redux";
import React, { useRef, useState } from "react";
import Label from "../../../components/Label";
import { truncateText } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { deleteChat, getChats } from "../../../utils/storage";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

type Props = {
  open: boolean;
  setSidebarOpened: (val: boolean) => void;
};

function Sidebar({ open, setSidebarOpened }: Props) {
  const mode = useSelector((state: RootState) => state.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [openedByClick, setOpenedByClick] = useState(false);

  const toggleMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    dispatch(setMode(newMode));
  };

  const navigateToApp = () => navigate("/app");
  const chats = getChats();

  const sidebarRef = useRef<HTMLDivElement>(null);

  const isDesktop = window.innerWidth >= 768;

  const toggleWidth = () => {
    if (!sidebarRef.current) return;

    const currentWidth = getComputedStyle(sidebarRef.current).width;

    if (currentWidth === "90px") {
      if (isDesktop) {
        sidebarRef.current.style.width = "270px";
      }
      setSidebarOpened(true);
      setOpenedByClick(true);
    } else {
      if (isDesktop) {
        sidebarRef.current.style.width = "90px";
      }
      setSidebarOpened(false);
      setOpenedByClick(false);
    }
  };

  const handleMouseEnter = () => {
    if (!openedByClick && sidebarRef.current) {
      sidebarRef.current.style.width = "270px";
      setSidebarOpened(true);
    }
  };

  const handleMouseLeave = () => {
    if (!openedByClick && sidebarRef.current) {
      sidebarRef.current.style.width = "90px";
      setSidebarOpened(false);
    }
  };

  const handleDeleteChat = () => {
    deleteChat(id);
    handleCloseDeleteModal();
    const notification = {
      type: "success",
      title: "Chat deleted",
      msg: `Chat deleted successfuly, and can't be undo`,
      time: new Date(),
    } as NotificationType;
    dispatch(addNotification(notification));
    setTimeout(() => navigate("/app"), 50);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setId("");
  };

  const handleOpenDeleteModal = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setDeleteModal(true);
    setId(id);
  };

  return (
    <>
      <StyledSidebar open={open} ref={sidebarRef}>
        <TopSection>
          <IconWrapper open={open}>
            <FontAwesomeIcon
              onClick={toggleWidth}
              icon={faBars}
              color="#a9a9a9"
              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
            />
            {open && (
              <DesktopOnly>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  color="#a9a9a9"
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                  onClick={() => navigate("search")}
                />
              </DesktopOnly>
            )}
          </IconWrapper>
          <IconWrapper open={open}>
            <FontAwesomeIcon
              onClick={navigateToApp}
              icon={faPenToSquare}
              color="#a9a9a9"
              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
            />
            {open && (
              <DesktopOnly style={{ marginRight: "auto" }}>
                <Label
                  onClick={navigateToApp}
                  color="#a9a9a9"
                  sx={{ marginRight: "auto" }}
                >
                  New Chat
                </Label>
              </DesktopOnly>
            )}
          </IconWrapper>
        </TopSection>

        <MiddleSection
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ChatsWrapper>
            {chats.map((chat) => (
              <Chat
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
                onClick={() => navigate(chat.id)}
                key={chat.id}
              >
                <Label color="#a9a9a9">{truncateText(chat.chats[0].msg)}</Label>
                {hoveredChat === chat.id && (
                  <FontAwesomeIcon
                    onClick={(e) => handleOpenDeleteModal(e, chat.id)}
                    icon={faTrash}
                    color="#a9a9a9"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </Chat>
            ))}
          </ChatsWrapper>
        </MiddleSection>

        <BottomSection>
          <ToggleSwitch>
            <ToggleCircle onClick={toggleMode} mode={mode}>
              <FontAwesomeIcon icon={faMoon} />
            </ToggleCircle>
            <ToggleCircle onClick={toggleMode} mode={mode} $isSun>
              <FontAwesomeIcon icon={faSun} />
            </ToggleCircle>
          </ToggleSwitch>
        </BottomSection>
      </StyledSidebar>

      {deleteModal && (
        <Modal
          width="40vw"
          title="Delete Chat"
          onClose={handleCloseDeleteModal}
        >
          <ConfirmModalContent>
            <Label size="0.8" color="#a9a9a9">
              Are you sure you want to delete this chat?
            </Label>
            <Label size="0.8" color="#a9a9a9">
              This action cannot be undone, and all messages will be permanently
              removed.
            </Label>
            <ModalActions>
              <Button intent="success" onClick={handleDeleteChat}>
                Confirm
              </Button>
              <Button
                intent="error"
                variant="secondary"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </Button>
            </ModalActions>
          </ConfirmModalContent>
        </Modal>
      )}
    </>
  );
}

const StyledSidebar = styled.div<{ open: boolean }>`
  background-color: ${(p) => p.theme.bg.base300};
  height: 100%;
  transition: all 0.3s ease;
  overflow: hidden;
  box-sizing: border-box;

  @media (min-width: 768px) {
    width: 90px;
  }

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: ${(p) => (p.open ? "0" : "-100%")};
    width: 270px;
    z-index: 1000;
  }
`;

const DesktopOnly = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

const TopSection = styled.div`
  height: 18%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
`;

const IconWrapper = styled.div<{ open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.open ? "space-between" : "center")};
  gap: 10px;
  padding: 10px;
`;

const MiddleSection = styled.div`
  height: 72%;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
`;

const ChatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Chat = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    background-color: ${(p) => p.theme.bg.base100};
  }
`;

const BottomSection = styled.div`
  height: 10%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: start;
  box-sizing: border-box;
`;

const ToggleSwitch = styled.div`
  width: 70px;
  height: 30px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 3px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ToggleCircle = styled.div<{ mode: string; $isSun?: boolean }>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSun
      ? props.mode === "light"
        ? "orange"
        : "transparent"
      : props.mode === "light"
      ? "transparent"
      : "gray"};
  color: ${(props) =>
    props.$isSun
      ? props.mode === "light"
        ? "white"
        : "gray"
      : props.mode === "light"
      ? "black"
      : "white"};
  left: ${(props) =>
    props.$isSun
      ? props.mode === "light"
        ? "48px"
        : "2px"
      : props.mode === "light"
      ? "2px"
      : "48px"};
  transition: 0.3s ease-in-out;
`;

const ConfirmModalContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
`;

export default Sidebar;
