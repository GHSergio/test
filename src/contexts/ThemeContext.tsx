// ThemeContext.tsx
import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../components/Theme";
// 規範 ThemeMode 只能是 light or dark
type ThemeMode = "light" | "dark";

// 定義 Context 的值類型
export interface ThemeContextProps {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

//創建context 並且 初始值為undefined
//類型推斷型別為ThemeContextProps | undefined
export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

//意味著 ThemeProviderComponent 是一個函數型組件，它的 props 包含 children，children 是 ReactNode 類型，代表了組件的子元素。
export const ThemeProviderComponent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  //切換主題fn
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  //useMemo用來記憶化 theme 的計算結果，僅當 mode 改變時才重新計算主題，優化性能。
  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    //提供 mode & toggleTheme
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
