import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/useSlice";
import modalReducer from "./slice/modalSlice";


export const store = configureStore({
      reducer: {
            user: userReducer,
            modal: modalReducer, // Add modal reducer to the store
      },
});

