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

export const fetchOnlineFriends = createAsyncThunk(
  "friends/fetchOnlineFriends",
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("friends")
        .select(`
          id,
          user_id,
          friend_id,
          status,
          profiles:user_id!inner(username, avatar_url, bio, user_status),
          friend_profiles:friend_id!inner(username, avatar_url, user_status)
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq("status", "accepted")
        .filter("profiles.user_status", "eq", "online")
        .filter("friend_profiles.user_status", "eq", "online");

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching online friends:", err);
      return rejectWithValue(err.message);
    }
  }
);


const friendSlice = createSlice({
  name: "friends",
  initialState: {
    list: [],
    onlineList: [],
    fetchStatus: "idle", // Status for fetchFriends
    fetchOnlineStatus: "idle", // Status for fetchOnlineFriends
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
      state.onlineList = []; // Clear online friends
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
  .addCase(fetchFriends.pending, (state) => {
    state.fetchStatus = "loading";
  })
  .addCase(fetchFriends.fulfilled, (state, action) => {
    state.fetchStatus = "succeeded";
    state.list = action.payload;
  })
  .addCase(fetchFriends.rejected, (state, action) => {
    state.fetchStatus = "failed";
    state.error = action.payload;
  })
  .addCase(fetchOnlineFriends.pending, (state) => {
    state.fetchOnlineStatus = "loading";
  })
  .addCase(fetchOnlineFriends.fulfilled, (state, action) => {
    state.fetchOnlineStatus = "succeeded";
    state.onlineList = action.payload;
  })
  .addCase(fetchOnlineFriends.rejected, (state, action) => {
    state.fetchOnlineStatus = "failed";
    state.error = action.payload;
  });

  },
});

export const { updateFriend, deleteFriend, resetFriends } = friendSlice.actions;
export default friendSlice.reducer;
