export interface ColorTheme {
  type: "color";
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

export interface BackgroundTheme {
  type: "background";
  name: string;
  displayName: string;
  previewImage: string;
}

export type Theme = ColorTheme | BackgroundTheme;

export interface SelectedTheme {
  name: string;
  type: "color" | "background";
}

export interface ThemeConfig {
  colors: ColorTheme[];
  backgrounds: BackgroundTheme[];
}
