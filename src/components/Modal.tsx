import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Label from "./Label";

type Props = {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  width?: string;
  height?: string;
  hideHeader?: boolean;
};

const modalRoot = document.getElementById("modal-root");

function Modal({
  children,
  onClose,
  width,
  title,
  height,
  hideHeader = true,
}: Props) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent
        height={height}
        width={width}
        onClick={(e) => e.stopPropagation()}
      >
        {hideHeader ? (
          <Header>
            <Label size="1.2rem" weight={500}>
              {title}
            </Label>
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              onClick={onClose}
              icon={faX}
            />
          </Header>
        ) : null}
        {children}
      </ModalContent>
    </ModalOverlay>,
    modalRoot
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div<{ width?: string; height?: string }>`
  background-color: ${(p) => p.theme.bg.base100};
  border-radius: 5px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: ${(p) => (p.width ? p.width : "30vw")};
  height: ${(p) => (p.height ? p.height : "fit-content")};
  color: ${(p) => p.theme.color.text};

  @media (max-width: 426px) {
    width: 70vw;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: ${(p) => p.theme.bg.base200};
`;

export default Modal;
