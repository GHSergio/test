import { useContext } from "react";
import { MovieContext, MovieContextProps } from "./MovieContext";
export const useMovie = (): MovieContextProps => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
};
