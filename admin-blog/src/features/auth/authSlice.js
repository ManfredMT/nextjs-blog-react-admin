import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  user: null,
  isError: false,
  isChangePWError:false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    let message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    if (error?.response?.status === 429) {
      message = "登录过于频繁，请稍后再试";
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const checkJWT = createAsyncThunk("auth/checkJWT", async (thunkAPI) => {
  try {
    return await authService.getUserData(
      JSON.parse(localStorage.getItem("user")).token
    );
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const changePasswd = createAsyncThunk("auth/change-password", 
async (passwordData, thunkAPI)=>{
  try {
    return await authService.changePassword(
      JSON.parse(localStorage.getItem("user")).token,passwordData
    );
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
}
)

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.isChangePWError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkJWT.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkJWT.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = JSON.parse(localStorage.getItem("user"));
      })
      .addCase(checkJWT.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(changePasswd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePasswd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //重新登录
        localStorage.removeItem("user");
        state.user = null;
        state.message = "密码修改成功,请重新登录"
      })
      .addCase(changePasswd.rejected, (state, action) => {
        state.isChangePWError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
