import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bg: {
      base100: string;
      base200: string;
      base300: string;
    };
    color: {
      text: string;
      blue100: string;
      blue200: string;
      blue300: string;
      gary100: string;
      gray200: string;
    };
  }
}
