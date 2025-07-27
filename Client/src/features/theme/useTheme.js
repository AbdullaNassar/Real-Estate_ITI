// src/features/theme/useTheme.js
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "./themeSlice";

export function useTheme() {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
  };
}
