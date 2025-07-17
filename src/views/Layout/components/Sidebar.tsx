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
import { useRef, useState } from "react";
import Label from "../../../components/Label";
import { truncateText } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { deleteChat, getChats } from "../../../utils/storage";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

function Sidebar() {
  const mode = useSelector((state: RootState) => state.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpened, setSidebarOpened] = useState<boolean>(false);
  const [openedByClick, setOpenedByClick] = useState(false);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  const toggleMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    dispatch(setMode(newMode));
  };

  const navigateToApp = () => {
    navigate("/app");
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleWidth = () => {
    if (!sidebarRef.current) return;

    const currentWidth = getComputedStyle(sidebarRef.current).width;

    if (currentWidth === "90px") {
      sidebarRef.current.style.width = "270px";
      setSidebarOpened(true);
      setOpenedByClick(true);
    } else {
      sidebarRef.current.style.width = "90px";
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

  const chats = getChats();

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
    setTimeout(() => {
      navigate("/app");
    }, 50);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setId("");
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeleteModal(true);
    setId(id);
  };

  return (
    <>
      <StyledSidebar open={sidebarOpened} ref={sidebarRef}>
        <TopSection>
          <IconWrapper>
            <FontAwesomeIcon
              onClick={toggleWidth}
              icon={faBars}
              color="#a9a9a9"
              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
            />
            {sidebarOpened && (
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
            )}
          </IconWrapper>
          <IconWrapper>
            <FontAwesomeIcon
              onClick={navigateToApp}
              icon={faPenToSquare}
              color="#a9a9a9"
              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
            />
            {sidebarOpened && (
              <Label
                onClick={navigateToApp}
                color="#a9a9a9"
                sx={{ marginRight: "auto" }}
              >
                New Chat
              </Label>
            )}
          </IconWrapper>
        </TopSection>

        <MiddleSection
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {sidebarOpened && (
            <ChatsWrapper>
              {chats.map((chat) => (
                <Chat
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  onClick={() => navigate(chat.id)}
                  key={chat.id}
                >
                  <Label color="#a9a9a9">
                    {truncateText(chat.chats[0].msg)}
                  </Label>
                  {hoveredChat === chat.id && (
                    <FontAwesomeIcon
                      onClick={() => handleOpenDeleteModal(chat.id)}
                      icon={faTrash}
                      color="#a9a9a9"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </Chat>
              ))}
            </ChatsWrapper>
          )}
        </MiddleSection>

        <BottomSection open={sidebarOpened}>
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
          <ConfirmModalContent
          >
            <Label size="0.8" color="#a9a9a9">
              Are you sure you want to delete this chat?
            </Label>
            <Label size="0.8" color="#a9a9a9">
              This action cannot be undone, and all messages will be permanently
              removed.
            </Label>
            <ModalActions
            >
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
  width: 90px;
  height: 100%;
  background-color: ${(p) => p.theme.bg.base300};
  transition: width 0.3s ease;
  box-sizing: border-box;
  padding: ${(p) => (p.open ? "0px 10px" : "0px")};
`;

const TopSection = styled.div`
  width: 100%;
  height: 18%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  padding: 10px 0px;
`;

const IconWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: width 0.3s ease-in-out;
`;

const MiddleSection = styled.div`
  width: 100%;
  height: 72%;
`;

const BottomSection = styled.div<{ open: boolean }>`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.open ? "start" : "center")};
`;

const ToggleSwitch = styled.div`
  width: 70px;
  height: 30px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 3px;
  position: relative;
`;

const ToggleCircle = styled.div<{ mode: string; $isSun?: boolean }>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$isSun
      ? props.mode === "light"
        ? "orange"
        : "transparent"
      : props.mode === "light"
      ? "transparent"
      : "gray"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$isSun
      ? props.mode === "light"
        ? "white"
        : "gray"
      : props.mode === "light"
      ? "black"
      : "white"};
  cursor: pointer;
  position: absolute;
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

const ChatsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`;

const Chat = styled.div`
  width: 90%;
  min-height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 10px;
  background-color: transparent;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${(p) => p.theme.bg.base100};
  }
`;

const ConfirmModalContent = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 15px;
`;

const ModalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
`;

export default Sidebar;
