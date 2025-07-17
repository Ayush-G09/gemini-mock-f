import ReactDOM from "react-dom";
import styled from "styled-components";
import NotificationCard from "./components/NotificationCard";
import { useSelector } from "react-redux";
import { NotificationType } from "../../types/redux";

const modalRoot = document.getElementById("notifications-root");

function Notification() {
  const notifications = useSelector(
    (state: { mode: string; notifications: NotificationType[] }) =>
      state.notifications
  );

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <NotificationOverlay>
      {notifications.map((card) => (
        <NotificationCard
          key={card.time instanceof Date ? card.time.getTime() : card.time}
          title={card.title}
          msg={card.msg}
          time={card.time}
          type={card.type}
        />
      ))}
    </NotificationOverlay>,
    modalRoot
  );
}

const NotificationOverlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;
  pointer-events: none;
  gap: 1rem;
  box-sizing: border-box;
  padding-top: 15px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;

  scrollbar-width: none;
`;

export default Notification;
