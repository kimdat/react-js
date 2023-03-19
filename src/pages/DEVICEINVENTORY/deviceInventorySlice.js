import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  error: null,
};

export const deviceInventorySlice = createSlice({
  name: "deviceInventory",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = deviceInventorySlice.actions;

export default deviceInventorySlice.reducer;
