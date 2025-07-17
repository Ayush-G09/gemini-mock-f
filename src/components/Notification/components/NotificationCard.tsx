import {
  faCircleCheck,
  faChevronDown,
  faChevronUp,
  faX,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Label from "../../Label";
import { NotificationType } from "../../../types/redux";
import { deleteNotification } from "../../../store/actions";

type State = {
  collapse: boolean;
  remainingSeconds: number;
};

function NotificationCard({ title, msg, time, type}: NotificationType) {
  const [state, setState] = useState<State>({
    collapse: false,
    remainingSeconds: 10,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - new Date(time).getTime()) / 1000
      );
      const secondsLeft = 10 - diffInSeconds;

      if (secondsLeft <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setState((prev) => ({ ...prev, remainingSeconds: 0 }));
        dispatch(deleteNotification(time));
      } else {
        setState((prev) => ({ ...prev, remainingSeconds: secondsLeft }));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [time, dispatch]);

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    dispatch(deleteNotification(time));
  };

  const handleToggleCollapse = () => {
    setState((prev) => ({ ...prev, collapse: !prev.collapse }));
  };

  return (
    <Card>
      <Header>
        <FontAwesomeIcon icon={type === 'success' ? faCircleCheck : faCircleXmark} color={type === "success" ? "#38BB73" : "red"} />
        <Label weight={600}color="black" >{title}</Label>
        <FontAwesomeIcon
          onClick={handleToggleCollapse}
          icon={state.collapse ? faChevronUp : faChevronDown}
          color="#a9a9a9"
          style={{ cursor: "pointer", marginLeft: "auto" }}
        />
        <FontAwesomeIcon
          icon={faX}
          onClick={handleClose}
          color="#a9a9a9"
          style={{
            cursor: "pointer",
            fontSize: "0.9rem",
            marginLeft: "10px",
          }}
        />
      </Header>

      <Message $collapse={state.collapse}>
        <Label color="#a9a9a9" size="0.9rem">
          {msg}
        </Label>
      </Message>

      <Footer>
        <Label size="0.9rem" color="#a9a9a9" sx={{ paddingLeft: "10px" }}>
          This message will close in{" "}
          <span style={{ fontWeight: 600 }}>{state.remainingSeconds}</span>{" "}
          seconds.
        </Label>
        <Loader type={type} $percent={(state.remainingSeconds / 10) * 100} />
      </Footer>
    </Card>
  );
}

const Card = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  pointer-events: auto;
  transition: max-height 0.5s ease-in-out;

  min-height: 76px;

  /* Start off-screen to the right */
  transform: translateX(100%);
  opacity: 0;

  /* Animate into view */
  animation: slideIn 0.4s ease-out forwards;

  @keyframes slideIn {
    to {
      transform: translateX(-5%);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  align-items: center;
  gap: 10px;
`;

const Message = styled.div<{ $collapse: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: 0 40px;
  height: ${(p) => (p.$collapse ? "50px" : "0")};
  opacity: ${(p) => (p.$collapse ? 1 : 0)};
  padding-bottom: ${(p) => (p.$collapse ? "10px" : "0")};
  max-height: 500px;
  transition: all 0.5s ease-in-out;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f2f4;
  box-sizing: border-box;
  padding-top: 5px;
`;

const Loader = styled.div<{ $percent: number, type: 'success' | 'error'}>`
  width: ${(p) => `${p.$percent}%`};
  height: 5px;
  background-color: ${(p) => p.type === "success" ? "#38BB73" : "red"};
  margin-top: 5px;
  transition: width 1s linear;
`;

export default NotificationCard;
