import React, { useRef } from "react";
import styled from "styled-components";
import Label from "./Label";

type OtpInputProps = {
  value: string;
  active: boolean;
  error: string;
  onChange: (value: string) => void;
};

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  active,
  error,
}) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d?$/.test(digit)) return;

    const newValue = value.split("");
    newValue[index] = digit;
    onChange(newValue.join(""));

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <StyledOtp>
      <Wrapper>
        {[...Array(6)].map((_, i) => (
          <DigitInput
            disabled={!active}
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
          />
        ))}
      </Wrapper>
      {error && (
        <Label size="0.8rem" sx={{ marginTop: "4px" }} color="red">
          {error}
        </Label>
      )}
    </StyledOtp>
  );
};

const StyledOtp = styled.div`
display: flex;
flex-direction: column;
width: 80%;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const DigitInput = styled.input`
  width: 28px;
  height: 36px;
  font-size: 20px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: 0.2s all ease;
  background-color: transparent;
  color: ${(p) => p.theme.color.text};

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

export default OtpInput;
