// src/contexts/useThemeContext.ts
import { useContext } from "react";
import { ThemeContext, ThemeContextProps } from "./ThemeContext";

//如果 useContext(ThemeContext) 返回 undefined，這通常意味著 useTheme 被用在沒有 ThemeProviderComponent 的組件中。
export const useThemeContext = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
