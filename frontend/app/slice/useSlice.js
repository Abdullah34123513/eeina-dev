import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handlePostApi from "../../src/API/Handler/postApi.handler";
import handleGetApi from "../../src/API/Handler/getApi.handler";

// Async thunk for user login
export const loginUser = createAsyncThunk(
      "user/loginUser",
      async (userCredentials, thunkAPI) => {
            try {
                  const res = await handlePostApi("user/login", userCredentials);
                  return res.data; // Assuming the API returns user data
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
            }
      }
);

// Async thunk for user signup
export const signupUser = createAsyncThunk(
      "user/signupUser", // Fixed name
      async (userCredentials, thunkAPI) => {
            try {
                  const res = await handlePostApi("user/signup", userCredentials);
                  return res.data;
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response?.data?.message || "Signup failed");
            }
      }
);

export const getUserProfile = createAsyncThunk(
      "user/getUserProfile",
      async (_, thunkAPI) => {
            try {
                  const res = await handleGetApi("user/profile");
                  return res.data;
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response?.data?.message || "Get user profile failed");
            }
      }
);



// Async thunk for user logout
export const logoutUser = createAsyncThunk(
      "user/logout",
      async (_, thunkAPI) => {
            try {
                  const res = await handlePostApi("user/logout");
                  return res.data;
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
            }
      }
);

// Initial state
const initialState = {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
};

const userSlice = createSlice({
      name: "user",
      initialState,
      extraReducers: (builder) => {
            builder
                  // Login cases
                  .addCase(loginUser.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(loginUser.fulfilled, (state) => {
                        state.loading = false;
                  })
                  .addCase(loginUser.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                  })

                  // Signup cases
                  .addCase(signupUser.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(signupUser.fulfilled, (state) => {
                        state.loading = false;
                  })
                  .addCase(signupUser.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                  })

                  // Get user profile cases
                  .addCase(getUserProfile.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(getUserProfile.fulfilled, (state, action) => {
                        state.loading = false;
                        state.isAuthenticated = true;
                        state.user = action.payload;
                  })
                  .addCase(getUserProfile.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                  })

                  // Logout cases
                  .addCase(logoutUser.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(logoutUser.fulfilled, (state) => {
                        state.loading = false;
                        state.isAuthenticated = false;
                        state.user = null;
                        state.error = null;
                  })
                  .addCase(logoutUser.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                  });
      },
});

export default userSlice.reducer;
