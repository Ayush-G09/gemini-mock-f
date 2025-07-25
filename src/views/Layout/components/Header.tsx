import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import userIcon from "../../../assets/gif/worker.gif";
import Label from "../../../components/Label";

type Props = {
  onOpenSidebar: () => void;
};

function Header({ onOpenSidebar }: Props) {
  return (
    <StyledHeader>
      <MobileMenuIcon onClick={onOpenSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </MobileMenuIcon>
      <Label size="1.2rem" sx={{ marginRight: "auto" }} color="#a9a9a9">
        Gemini
      </Label>
      <UserAvatar>
        <img
          alt="userIcon"
          src={userIcon}
          style={{ width: "2rem", height: "2rem" }}
        />
      </UserAvatar>
    </StyledHeader>
  );
}

const StyledHeader = styled.div`
  width: 100%;
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: end;
  box-sizing: border-box;
  padding: 0 15px;
  gap: 15px;
  position: relative;
`;

const MobileMenuIcon = styled.div`
  display: none;
  color: #a9a9a9;
  cursor: pointer;
  font-size: 1.4rem;

  @media (max-width: 767px) {
    display: block;
    margin-right: auto;
  }
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${(p) => p.theme.bg.base300};
  box-shadow: inset 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Header;
