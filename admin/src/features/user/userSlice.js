import { createSlice } from "@reduxjs/toolkit";

import {
      loginUser,
      getUserProfile,
      updateUserProfile,
      logoutUser,
} from "./userThunks";

// Slice
const userSlice = createSlice({
      name: "user",
      initialState: {
            loading: false,
            isAuthenticated: false,
            user: null,
      },
      extraReducers: (builder) => {
            builder
                  .addCase(loginUser.pending, (state) => {
                        state.loading = true;
                  })
                  .addCase(loginUser.fulfilled, (state) => {
                        state.loading = false;
                  })
                  .addCase(loginUser.rejected, (state) => {
                        state.loading = false;
                  })
                  .addCase(getUserProfile.pending, (state) => {
                        state.loading = true;
                  })
                  .addCase(getUserProfile.fulfilled, (state, action) => {
                        state.loading = false;
                        state.isAuthenticated = true;
                        state.user = action.payload;
                  })
                  .addCase(getUserProfile.rejected, (state) => {
                        state.loading = false;
                  })
                  .addCase(updateUserProfile.pending, (state) => {
                        state.loading = true;
                  })
                  .addCase(updateUserProfile.fulfilled, (state, action) => {
                        state.loading = false;
                        state.user = action.payload;
                  })
                  .addCase(updateUserProfile.rejected, (state) => {
                        state.loading = false;
                  })
                  .addCase(logoutUser.pending, (state) => {
                        state.loading = true;
                  })
                  .addCase(logoutUser.fulfilled, (state) => {
                        state.loading = false;
                        state.isAuthenticated = false;
                        state.user = null;
                  })
                  .addCase(logoutUser.rejected, (state) => {
                        state.loading = false;
                  });
      },
});

export default userSlice.reducer;
