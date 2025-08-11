import { createAsyncThunk } from "@reduxjs/toolkit";
import handleApi from "../../api/handler/apiHanlder";

export const loginUser = createAsyncThunk(
      "user/loginUser",
      async (data, thunkAPI) => {
            try {
                  const res = await handleApi("user/admin/login", "POST", data);
                  console.log("Login Response:", res);
                  if (res.data?.user?.role !== "admin" && res.data?.user?.role !== "super-admin") {
                        return thunkAPI.rejectWithValue("Unauthorized access");
                  }
                  return res;
            } catch (error) {
                  return thunkAPI.rejectWithValue(
                        error.response?.data?.message || error.message
                  );
            }
      }
);

export const getUserProfile = createAsyncThunk(
      "user/getUserProfile",
      async (_, thunkAPI) => {
            try {
                  const { data: res } = await handleApi("user/profile", "GET");
                  console.log("User Profile Data:", res);
                  if (res.role !== "admin" && res.role !== "super-admin") {
                        return thunkAPI.rejectWithValue("Unauthorized access");
                  }
                  return res;
            } catch (error) {
                  return thunkAPI.rejectWithValue(
                        error.response?.data?.message || error.message
                  );
            }
      }
);

export const updateUserProfile = createAsyncThunk(
      "user/updateUserProfile",
      async (data, thunkAPI) => {
            try {
                  return await handleApi("user/profile", "PUT", data);
            } catch (error) {
                  return thunkAPI.rejectWithValue(
                        error.response?.data.message || error.message
                  );
            }
      }
);

export const logoutUser = createAsyncThunk(
      "user/logoutUser",
      async (_, thunkAPI) => {
            try {
                  return await handleApi("user/logout", "POST");
            } catch (error) {
                  return thunkAPI.rejectWithValue(
                        error.response?.data || error.message
                  );
            }
      }
);
