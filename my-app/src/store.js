// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/userSlice";
import friendReducer from "./redux/friendSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    friends: friendReducer,
  },
});

export default store;

