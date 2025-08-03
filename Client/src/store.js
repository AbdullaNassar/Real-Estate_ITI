import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme/themeSlice";
import userReduces from "./features/auth/userSlice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReduces,
  },
});
