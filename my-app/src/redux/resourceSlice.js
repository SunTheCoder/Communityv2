import { createSlice } from '@reduxjs/toolkit';

const resourceSlice = createSlice({
  name: 'resources',
  initialState: {
    resources: [],
  },
  reducers: {
    setResources: (state, action) => {
      state.resources = action.payload;
    },
    addResource: (state, action) => {
      state.resources.push(action.payload);
    },
  },
});

export const { setResources, addResource } = resourceSlice.actions;

export default resourceSlice.reducer;
