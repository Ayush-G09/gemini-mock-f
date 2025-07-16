import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { MoonLoader } from "react-spinners";
import styled, { CSSProperties } from "styled-components";

type Props = {
  children?: React.ReactNode;
  sx?: CSSProperties;
  onClick?: () => void;
  loading?: boolean;
  icon?: IconDefinition;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  type?: "button" | "submit" | "reset" | undefined;
};

function Button({
  children,
  sx,
  onClick,
  loading = false,
  icon,
  iconPosition = "left",
  disabled = false,
  variant = "primary",
  type = undefined,
}: Props) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      disabled={loading || disabled}
      onClick={onClick}
      style={sx}
    >
      {icon && iconPosition === "left" && <FontAwesomeIcon icon={icon} />}
      {loading ? <MoonLoader size={20} color="white" /> : children}
      {icon && iconPosition === "right" && <FontAwesomeIcon icon={icon} />}
    </StyledButton>
  );
}

const StyledButton = styled.button<{
  $variant: "primary" | "secondary" | "tertiary";
  disabled: boolean;
}>`
  padding: 8px 16px;
  border-radius: 4px;
  max-height: 40px;
  border: ${(p) =>
    p.$variant === "secondary" ? `1px solid ${p.theme.color.blue200}` : "none"};
  background-color: ${(p) =>
    p.disabled
      ? p.theme.color.gary100
      : p.$variant === "primary"
      ? p.theme.color.blue200
      : "transparent"};
  color: ${(p) => (p.$variant === "primary" ? "#fff" : p.theme.color.blue200)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  gap: 8px;
  box-shadow: ${(p) =>
    p.$variant === "tertiary" ? "none" : "0 2px 4px rgba(0, 0, 0, 0.2)"};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(p) =>
      p.disabled
        ? p.theme.color.gray200
        : p.$variant === "primary"
        ? p.theme.color.blue300
        : "none"};
  }
`;

export default Button;
