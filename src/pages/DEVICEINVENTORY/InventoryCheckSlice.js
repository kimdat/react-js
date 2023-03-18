import { createSlice } from "@reduxjs/toolkit";

export const checkSlice = createSlice({
  name: "check",
  initialState: {
    checkedRows: [],
    checkAll: false,
  },
  reducers: {
    setCheckedRows(state, action) {
      state.checkedRows = action.payload;
    },
    setCheckAll(state, action) {
      state.checkAll = action.payload;
    },
    handleCheckAll: (state, action) => {
      const { searchApiData } = action.payload;
      state.checkAll = !state.checkAll;
      if (state.checkAll) {
        state.checkedRows = searchApiData.map(({ id, Name }) => ({
          id,
          name: Name,
        }));
      } else {
        state.checkedRows = [];
      }

      return state;
    },
    handleCheck: (state, action) => {
      const { row } = action.payload;
      const index = state.checkedRows.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        state.checkedRows.splice(index, 1);
      } else {
        state.checkedRows.push({ id: row.id, name: row.Name });
      }
    },
  },
});

export const { setCheckedRows, setCheckAll, handleCheck, handleCheckAll } =
  checkSlice.actions;
export const sliceCheckedRows = (state) => state.check.checkedRows;
export const sliceCheckAll = (state) => state.check.checkAll;
export default checkSlice.reducer;
