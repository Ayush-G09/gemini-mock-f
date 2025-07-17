import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import Label from "./Label";
import {
  faEye,
  faEyeSlash,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import styled, { CSSProperties } from "styled-components";
import { RootState } from "../types/redux";
import { useSelector } from "react-redux";

type Props = {
  value: string;
  error: string;
  field: string;
  type: string;
  name: string;
  logo: IconDefinition;
  onChange: (value: string, field: any) => void;
  sx?: CSSProperties;
};

type State = {
  showInput: boolean;
  showPassword: boolean;
};

function InputField({
  value,
  error,
  onChange,
  field,
  type,
  name,
  logo,
  sx,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>({
    showInput: false,
    showPassword: false,
  });
  const mode = useSelector((state: RootState) => state.mode);

  const handleDivFocus = () => {
    setState((prev) => ({ ...prev, showInput: true }));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleDivBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setState((prev) => ({ ...prev, showInput: false }));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <Wrapper>
      <Container
        onFocus={handleDivFocus}
        onBlur={handleDivBlur}
        ref={containerRef}
        tabIndex={0}
        $isFocused={state.showInput}
        $hasError={!!error}
        style={sx}
      >
        <FontAwesomeIcon color="#a9a9a9" icon={logo} />
        <InputWrapper>
          <Label
            color={
              value
                ? mode === "light"
                  ? "black"
                  : "white"
                : state.showInput
                ? mode === "light"
                  ? "black"
                  : "white"
                : "#d3d3d3"
            }
            size={value ? "0.8rem" : state.showInput ? "0.8rem" : "1rem"}
          >
            {name}
          </Label>
          {(value || state.showInput) && (
            <StyledInput
              ref={inputRef}
              onChange={(e) => onChange(e.target.value, field)}
              type={
                type === "password"
                  ? state.showPassword
                    ? "text"
                    : "password"
                  : type
              }
              value={value}
              name={field}
            />
          )}
        </InputWrapper>
        {type === "password" && (
          <ToggleButton onClick={handleTogglePasswordVisibility}>
            <FontAwesomeIcon
              color="#a9a9a9"
              icon={state.showPassword ? faEye : faEyeSlash}
            />
          </ToggleButton>
        )}
      </Container>
      {error && (
        <Label size="0.8rem" sx={{ marginTop: "4px" }} color="red">
          {error}
        </Label>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div<{ $isFocused: boolean; $hasError: boolean }>`
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 10px;
  border: ${({ $hasError, $isFocused, theme }) =>
    `2px solid ${
      $hasError ? "red" : $isFocused ? theme.color.blue100 : theme.color.gary100
    }`};
  border-radius: 8px;
  gap: 10px;
`;

const InputWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled.input`
  outline: none;
  color: ${(p) => p.theme.color.gray200};
  width: 95%;
  height: 20px;
  font-size: 1rem;
  border: none;
  background: transparent;

  &:-webkit-autofill {
    -webkit-text-fill-color: ${(p) => p.theme.color.gray200};
    transition: background-color 9999s ease-in-out 0s;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
`;

const ToggleButton = styled.div`
  width: 10%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default InputField;
