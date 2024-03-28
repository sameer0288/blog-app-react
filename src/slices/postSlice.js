import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
});

export const createNewPost = createAsyncThunk(
  "posts/createNewPost",
  async (newPost) => {
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      newPost
    );
    return response.data;
  }
);

export const updateExistingPost = createAsyncThunk(
  "posts/updateExistingPost",
  async (updatedPost) => {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
      updatedPost
    );
    return response.data;
  }
);

export const deleteExistingPost = createAsyncThunk(
  "posts/deleteExistingPost",
  async (postId) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    return postId;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    filteredItems: [],
    isLoading: true,
    isEditing: false,
    selectedPost: null,
    editTitle: "",
    editBody: "",
    showLoadingAnimation: false,
  },
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
      state.editTitle = action.payload.title;
      state.editBody = action.payload.body;
      state.isEditing = true;
    },
    closeEditPopup: (state) => {
      state.isEditing = false;
      state.selectedPost = null;
      state.editTitle = "";
      state.editBody = "";
    },
    setEditTitle: (state, action) => {
      state.editTitle = action.payload;
    },
    setFilteredPosts: (state, action) => {
      const filtered = state.items.filter((post) =>
        post.title.toLowerCase().includes(action.payload.toLowerCase())
      );
      state.filteredItems = filtered;
    },
    setEditBody: (state, action) => {
      state.editBody = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.isLoading = false;
        toast.error("Failed to fetch posts");
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.filteredItems.push(action.payload);
        toast.success("Post created successfully");
      })
      .addCase(createNewPost.rejected, (state) => {
        toast.error("Failed to create post");
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (post) => post.id === action.payload.id
        );
        state.items[index] = action.payload;
        state.filteredItems = [...state.items];
        toast.success("Post updated successfully");
        state.isEditing = false;
        state.selectedPost = null;
      })
      .addCase(updateExistingPost.rejected, (state) => {
        toast.error("Failed to update post");
        state.isEditing = false;
        state.selectedPost = null;
      })
      .addCase(deleteExistingPost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
        state.filteredItems = [...state.items];
        toast.success("Post deleted successfully");
      })
      .addCase(deleteExistingPost.rejected, (state) => {
        toast.error("Failed to delete post");
      });
  },
});

export const {
  setSelectedPost,
  closeEditPopup,
  setEditTitle,
  setFilteredPosts,
  setEditBody,
} = postSlice.actions;

export default postSlice.reducer;
