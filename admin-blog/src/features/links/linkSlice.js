import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import linkService from "./linkService";

const initialState = {
  links: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const createLink = createAsyncThunk(
  "links/create",
  async (linkData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await linkService.createLink(linkData, token);
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

export const getLinks = createAsyncThunk(
  "links/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await linkService.getLinks(token);
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

export const deleteLink = createAsyncThunk(
  "links/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await linkService.deleteLink(id, token);
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

export const updateLink = createAsyncThunk(
    "links/update",
    async (linkData, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        return await linkService.updateLink(linkData.get('linkId'),linkData,token);
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

export const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.links.push(action.payload);
        state.message = "成功创建友链";
      })
      .addCase(createLink.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getLinks.pending, (state) => {
        state.isLoading = true;
       
      })
      .addCase(getLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.links = action.payload;
        state.message = "";
      })
      .addCase(getLinks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.links = state.links.filter((link)=>link._id!==action.payload.id);
        state.message = "成功删除友链"
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updateLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const linksIndex = state.links.findIndex((link)=>link._id===action.payload.id);
        if(linksIndex !== -1) {
            state.links[linksIndex] = action.payload; 
        }
        state.message = "友链已更改"
      })
      .addCase(updateLink.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        
        state.message = action.payload;
      });
  },
});

export const { reset } = linkSlice.actions;
export default linkSlice.reducer;
