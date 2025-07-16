import { ReactNode } from "react";
import styled, { CSSProperties } from "styled-components";

type Props = {
  children?: ReactNode;
  weight?: number;
  size?: string;
  color?: string;
  sx?: CSSProperties;
  onClick?: () => void;
};

function Label({
  children,
  weight = 400,
  size = "1rem",
  color = "black",
  sx,
  onClick,
}: Props) {
  return (
    <StyledLabel
      onClick={onClick}
      style={sx}
      color={color}
      $weight={weight}
      size={size}
    >
      {children}
    </StyledLabel>
  );
}

const StyledLabel = styled.div<{
  $weight: number;
  size: string;
  color: string;
}>`
  font-weight: ${(p) => p.$weight};
  font-size: ${(p) => p.size};
  color: ${(p) => (p.color ? p.color : p.theme.color.text)};
  cursor: pointer;
`;

export default Label;
