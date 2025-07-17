import React, { useEffect, useRef, useState } from "react";
import Label from "../../components/Label";
import InputField from "../../components/InputField";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getChats } from "../../utils/storage";
import { formatToMonthDay, truncateText } from "../../utils";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

type State = {
  query: {
    value: string;
    error: string;
  };
};

function Search() {
  const [state, setState] = useState<State>({
    query: {
      value: "",
      error: "",
    },
  });

  const navigate = useNavigate();

  const [filteredChats, setFilteredChats] = useState(getChats());
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  const handleFieldChange = (
    value: string,
    field: keyof Pick<State, "query">
  ) => {
    setState((prev) => ({ ...prev, [field]: { ...prev[field], value } }));
  };

  useEffect(() => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }

    throttleRef.current = setTimeout(() => {
      const keyword = state.query.value.toLowerCase();
      const allChats = getChats();

      const result = allChats.filter((chat) =>
        chat.chats[0].msg.toLowerCase().includes(keyword)
      );

      setFilteredChats(result);
    }, 300);
  }, [state.query.value]);

  return (
    <Wrapper>
      <Content>
        <Label color="White" size="1.8rem" weight={500}>
          Search
        </Label>

        <InputField
          sx={{ borderWidth: "1px" }}
          value={state.query.value}
          error={state.query.error}
          field={"query"}
          type={"text"}
          name={"Search for chats"}
          logo={faMagnifyingGlass}
          onChange={handleFieldChange}
        />

        <ChatList>
          {filteredChats.map((chat) => (
            <ChatItem key={chat.id} onClick={() => navigate(`/app/${chat.id}`)}>
              <ChatMessage>
                <Label color="#d3d3d3">
                  {truncateText(chat.chats[0].msg, 60)}
                </Label>
              </ChatMessage>
              <ChatDate>
                <Label color="#a9a9a9">
                  {formatToMonthDay(chat.date.toLocaleString())}
                </Label>
              </ChatDate>
            </ChatItem>
          ))}
        </ChatList>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChatList = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: scroll;
  gap: 5px;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;

  scrollbar-width: none;
`;

const ChatItem = styled.div`
  min-height: 60px;
  height: 60px;
  width: 82%;
  border-bottom: 1px solid ${(p) => p.theme.bg.base300};
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(p) => p.theme.bg.base200};
  }
`;

const ChatMessage = styled.div`
  width: 80%;
`;

const ChatDate = styled.div`
  width: 20%;
  display: flex;
  justify-content: end;
`;

export default Search;
