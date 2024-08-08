// Theme.ts
import { createTheme, PaletteOptions } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// 擴展 PaletteOptions 接口以包括custom属性
declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      textColor: string;
      buttonTextColor: string;
      buttonBackgroundColor: string;
      buttonHover: string;
      buttonActive: string;
      cardBackground: string;
      inputBackground: string;
      inputTextColor: string;
      boxShadow: string;
      deleteIcon: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      textColor?: string;
      buttonTextColor?: string;
      buttonBackgroundColor?: string;
      buttonHover?: string;
      buttonActive?: string;
      cardBackground?: string;
      inputBackground?: string;
      inputTextColor?: string;
      boxShadow?: string;
      deleteIcon?: string;
    };
  }
}

// CustomPaletteOptions 擴展 PaletteOptions
interface CustomPaletteOptions extends PaletteOptions {
  mode: PaletteMode;
}

const lightPalette: CustomPaletteOptions = {
  mode: "light",
  primary: {
    main: "#1976d2",
  },
  secondary: {
    main: "#dc004e",
  },
  background: {
    default: "#00FFC8",
    paper: "#f5f5f5",
  },
  text: {
    primary: "#000000",
  },
  custom: {
    textColor: "#000000",
    buttonTextColor: "001a00",
    buttonBackgroundColor: "#c2f386",
    buttonHover: "#00cc76",
    inputBackground: "#CCFFF2",
    inputTextColor: "#CCFFF2",
    cardBackground: "#00EAFF",
    boxShadow: "0 0 5px 2px rgba(0,0,0,0.3)",
    deleteIcon: "#578b31",
    buttonActive: "#52c492",
  },
};

const darkPalette: CustomPaletteOptions = {
  mode: "dark",
  primary: {
    main: "#90caf9",
  },
  secondary: {
    main: "#f48fb1",
  },
  background: {
    default: "#121212",
    paper: "#424242",
  },
  text: {
    primary: "#32FFFF",
  },
  custom: {
    textColor: "#e9ffff",
    buttonTextColor: "#5f1f00",
    buttonBackgroundColor: "#db6449",
    buttonHover: "#00cc76",
    inputBackground: "#CCFFF2",
    inputTextColor: "#000000",
    cardBackground: "#009898",
    deleteIcon: "#571d53",
    buttonActive: "#3abe5e",
    // boxShadow: "0 0 5px 2px rgba(200,200,200,0.3)",
  },
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

export const lightTheme = createTheme({
  palette: lightPalette,
  breakpoints: breakpoints,
});

export const darkTheme = createTheme({
  palette: darkPalette,
  breakpoints: breakpoints,
});
