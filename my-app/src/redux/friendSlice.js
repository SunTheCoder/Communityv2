import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../App";

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (userId, { rejectWithValue }) => {
    try {
        const { data, error } = await supabase
        .from("friends")
        .select(`
          id,
          user_id,
          friend_id,
          status,
          profiles:user_id!inner(username, avatar_url, bio),
          friend_profiles:friend_id!inner(username, avatar_url)
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq("status", "accepted");
      

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching friends:", err);
      return rejectWithValue(err.message);
    }
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    updateFriend(state, action) {
      const index = state.list.findIndex((friend) => friend.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = action.payload;
      }
    },
    deleteFriend(state, action) {
      state.list = state.list.filter((friend) => friend.id !== action.payload.id);
    },
    resetFriends(state) {
      // Reset the state to the initial values
      state.list = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateFriend, deleteFriend, resetFriends } = friendSlice.actions;
export default friendSlice.reducer;
