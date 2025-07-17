import {
  faPaperclip,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Label from "../../components/Label";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { generateRandomId } from "../../utils";
import { addMessageToChat, createChat, getChatById } from "../../utils/storage";
import { PulseLoader } from "react-spinners";

function Dashboard() {
  const [message, setMessage] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  const [atBottom, setAtBottom] = useState<boolean>(true);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [loading, setLoading] = useState(true);


  const chatRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewChat = location.pathname === "/app";
  const chat = id ? getChatById(id) : null;

  const simulateAiResponse = (chatId: string) => {
    setTyping(true);
    const delay = Math.floor(Math.random() * 3000) + 3000;
    setTimeout(() => {
      addMessageToChat(chatId, "ai", "This is a simulated AI reply.");
      setTyping(false);
      scrollToBottom();
    }, delay);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && message.trim()) {
      event.preventDefault();
      if (isNewChat) {
        const newId = generateRandomId();
        createChat(newId);
        addMessageToChat(newId, "user", message.trim());
        setMessage("");
        navigate(`${newId}`);
        simulateAiResponse(newId);
        scrollToBottom();
      } else if (id) {
        addMessageToChat(id, "user", message.trim());
        setMessage("");
        simulateAiResponse(id);
        scrollToBottom();
      }
      setTimeout(scrollToBottom, 100);
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const atBottomNow = scrollHeight - scrollTop - clientHeight < 50;
    setAtBottom(atBottomNow);
  };

  useEffect(() => {
    if (id) {
      setTimeout(scrollToBottom, 100);
    }
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;

      if (isNewChat) {
        const newId = generateRandomId();
        createChat(newId);
        addMessageToChat(newId, "user", base64Image);
        navigate(`${newId}`);
        simulateAiResponse(newId);
      } else if (id) {
        addMessageToChat(id, "user", base64Image);
        simulateAiResponse(id);
      }

      scrollToBottom();
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (id && !getChatById(id)) {
      navigate("/app", { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!chatRef.current) return;

    const { scrollHeight, clientHeight } = chatRef.current;
    setCanScroll(scrollHeight > clientHeight);
  }, [chat?.chats.length, typing]);

  useEffect(() => {
  if (id) {
    setLoading(true);
    const delay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      setLoading(false);
      scrollToBottom();
    }, delay);
  }
}, [id]);


  return (
    <Wrapper>
      {isNewChat ? (
        <EmptyChat>
          <Label sx={{ color: "#388BFF" }} size="2rem" weight={600}>
            Hello, My Friend
          </Label>
        </EmptyChat>
      ) : (
        <ChatContainer ref={chatRef} onScroll={handleScroll}>
          {loading && !chat ? (
  Array.from({ length: 12 }).map((_, i) => (
    <SkeletonBubble key={i} $align={i%2 === 0 ? "flex-start" : "flex-end"} />
  ))
) : chat?.chats.map((msg) => {
            const isUser = msg.from === "user";
            const align = isUser ? "flex-end" : "flex-start";

            return (
              <>
              <MessageRow
                key={msg.timestamp}
                $align={align}
                onMouseEnter={() => setHoveredMsg(msg.timestamp)}
                onMouseLeave={() => setHoveredMsg(null)}
              >
                {!isUser && (
                  <>
                    <MessageBubble $align={align}>
                      <Label color="white">{msg.msg}</Label>
                    </MessageBubble>
                    {hoveredMsg === msg.timestamp && (
                      <CopyIcon onClick={() => copyToClipboard(msg.msg)}>
                        📋
                      </CopyIcon>
                    )}
                  </>
                )}
                {isUser && (
                  <>
                    {hoveredMsg === msg.timestamp && (
                      <CopyIcon onClick={() => copyToClipboard(msg.msg)}>
                        📋
                      </CopyIcon>
                    )}
                    <MessageBubble $align={align}>
                      {msg.msg.startsWith("data:image") ? (
                        <img
                          src={msg.msg}
                          alt="uploaded"
                          style={{ maxWidth: "150px", borderRadius: "8px" }}
                        />
                      ) : (
                        <Label color="white">{msg.msg}</Label>
                      )}
                    </MessageBubble>
                  </>
                )}
              </MessageRow>
              <Timestamp $align={align}>
      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Timestamp>
              </>
            );
          })}

          {typing && (
            <MessageBubble $align="flex-start">
              <Label color="white">Gemini is typing</Label>{" "}
              <PulseLoader color="white" size={3} />
            </MessageBubble>
          )}
        </ChatContainer>
      )}

      {/* Scroll Icon Toggle */}
      {!isNewChat && canScroll && (
        <ScrollToggle onClick={atBottom ? scrollToTop : scrollToBottom}>
          <FontAwesomeIcon
            icon={atBottom ? faArrowUp : faArrowDown}
            color="#388bff"
            size="lg"
          />
        </ScrollToggle>
      )}

      <InputArea>
        <InputWrapper>
          <Textarea
            onKeyDown={handleKeyDown}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something..."
          />
          <IconWrapper>
            <FontAwesomeIcon
              color="#a9a9a9"
              onClick={() => fileInputRef.current?.click()}
              icon={faPaperclip}
              style={{ cursor: "pointer" }}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </IconWrapper>
        </InputWrapper>
      </InputArea>
    </Wrapper>
  );
}

export default Dashboard;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const EmptyChat = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px;
  gap: 10px;
  overflow-y: scroll;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`;

const MessageBubble = styled.div<{ $align: string }>`
  display: flex;
  width: fit-content;
  max-width: 40%;
  align-self: ${(props) => props.$align};
  box-sizing: border-box;
  padding: 5px;
  border-radius: 8px;
  background-color: #388bff;
  align-items: end;
  gap: 5px;
`;

const InputArea = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputWrapper = styled.div`
  width: 50%;
  height: 60%;
  box-shadow: 0 0 5px 0 ${(p) => p.theme.color.gray200};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Textarea = styled.textarea`
  outline: none;
  resize: none;
  border: none;
  width: 90%;
  height: 80%;
  padding-left: 15px;
  padding-top: 30px;
  font-size: 1rem;
  background-color: transparent;
  color: ${(p) => p.theme.color.text};
`;

const IconWrapper = styled.div`
  width: 8%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScrollToggle = styled.div`
  position: absolute;
  right: 40%;
  bottom: 20%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 2;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MessageRow = styled.div<{ $align: string }>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.$align};
  align-items: center;
  gap: 8px;
`;

const CopyIcon = styled.span`
  cursor: pointer;
  font-size: 0.9rem;
  color: #fff;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const Timestamp = styled.span<{ $align: string }>`
  font-size: 0.7rem;
  color: #aaa;
  margin-left: 4px;
  align-self: ${(props) => props.$align};
`;

const SkeletonBubble = styled.div<{ $align: string }>`
  width: 20%;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(90deg, #ddd 25%, #ccc 50%, #ddd 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  align-self: ${(props) => props.$align};

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;
