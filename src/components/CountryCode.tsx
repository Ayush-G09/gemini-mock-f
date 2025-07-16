import React, { useEffect, useRef, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import Label from "./Label";
import { CountryCodeType } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

type Props = {
  value: {
    value: string;
    selected: CountryCodeType;
    error: string;
  };
  onChange: (value: string) => void;
  onSelect: (selected: CountryCodeType) => void;
  options: CountryCodeType[];
  sx?: CSSProperties;
};

type State = {
  showInput: boolean;
  filteredOptions: CountryCodeType[];
};

function CountryCode({ value, onChange, sx, options, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<State>({
    showInput: false,
    filteredOptions: [],
  });

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

  useEffect(() => {
    const search = value.value.toLowerCase();
    if (!search) {
      setState((prev) => ({ ...prev, filteredOptions: options }));
      return;
    }

    const newOptions = options?.filter(
      (option) =>
        option.callingCode.includes(search) ||
        option.name.toLowerCase().includes(search)
    );
    setState((prev) => ({ ...prev, filteredOptions: newOptions }));
  }, [value.value, options]);

  const handleSelect = (
    e: React.MouseEvent<HTMLElement>,
    selected: CountryCodeType
  ) => {
    e.stopPropagation();
    onSelect(selected);
  };

  return (
    <Wrapper>
      <Container
        onFocus={handleDivFocus}
        onBlur={handleDivBlur}
        ref={containerRef}
        tabIndex={0}
        $isFocused={state.showInput}
        $hasError={!!value.error}
        style={sx}
      >
        <FlagWrapper>
          {value.selected.flag ? (
            <StyledFlag src={value.selected.flag} />
          ) : (
            <FontAwesomeIcon color="#a9a9a9" icon={faFlag} />
          )}
        </FlagWrapper>
        {state.showInput || !value.selected.callingCode ? (
          <StyledInput
            onChange={(e) => onChange(e.target.value)}
            value={value.value}
            ref={inputRef}
            placeholder="Search Country Code"
          />
        ) : (
          <Label color="#a9a9a9">{`${value.selected.callingCode} ${value.selected.name}`}</Label>
        )}
      </Container>

      {value.error && (
        <Label size="0.8rem" sx={{ marginTop: "4px" }} color="red">
          {value.error}
        </Label>
      )}

      {state.showInput && (
        <Dropdown>
          {state.filteredOptions?.map((option) => (
            <Option
              key={`${option.callingCode}+${option.name}`}
              onMouseDown={(e) => handleSelect(e, option)}
            >
              <StyledFlag src={option.flag} />
              <Label>
                {option.callingCode} {option.name}
              </Label>
            </Option>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const Container = styled.div<{ $isFocused: boolean; $hasError: boolean }>`
  width: 100%;
  min-height: 55px;
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

const FlagWrapper = styled.div`
  width: 5%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledFlag = styled.img`
  width: 1rem;
  height: 1rem;
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

  ::placeholder {
    color: #d3d3d3;
    font-size: 1rem;
  }
`;

const Dropdown = styled.div`
  max-height: 300px;
  width: 100%;
  z-index: 5;
  position: absolute;
  top: 100%;
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`;

const Option = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 20px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #388bff;
  cursor: pointer;
`;

export default CountryCode;
