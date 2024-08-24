import { configureStore } from "@reduxjs/toolkit";
import movieSlice from "../slice/movieSlice";

const store = configureStore({
  reducer: {
    movie: movieSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
