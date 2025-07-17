import styled from "styled-components";
import userIcon from "../../../assets/gif/worker.gif";

function Header() {
  return (
    <StyledHeader>
      <UserAvatar>
        <img alt="userIcon" src={userIcon} style={{ width: "2rem", height: "2rem" }} />
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
