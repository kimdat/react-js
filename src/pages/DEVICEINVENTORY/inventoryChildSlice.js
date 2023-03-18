import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";

export const inventoriesChildSlice = createSlice({
  name: "inventoriesChild",
  initialState: {
    apiData: [],
    searchApiData: [],
    isExpandedAll: true,
    currentPage: 1,
    rowsPerPage: 10,
    totalRow: 0,
    isLoading: false,
    rowExpand: [],

    dataFilterNotPag: null,
  },
  reducers: {
    setRowExpand(state, action) {
      state.rowExpand = action.payload;
    },
    setIsExpandedAll(state, action) {
      state.isExpandedAll = action.payload;
    },
    setApiData(state, action) {
      state.apiData = action.payload;
    },
    setSearchApiData(state, action) {
      state.searchApiData = action.payload;
    },

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    setTotalRow(state, action) {
      state.totalRow = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },

    setDataFilterNotPag(state, action) {
      state.dataFilterNotPag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      "inventoriesComponent/handleSliceToggleRowDetails",
      (state, action) => {
        console.log(action);
      }
    );
  },
});

export const {
  setApiData,
  setSearchApiData,
  setIsExpandedAll,
  setCurrentPage,
  setRowsPerPage,
  setTotalRow,
  setIsLoading,
  setRowExpand,
  setIsSearch,
  setDataFilterNotPag,
} = inventoriesChildSlice.actions;

export const sliceApiData = (state) => state.inventoriesChild.apiData;
export const sliceSearchApiData = (state) =>
  state.inventoriesChild.searchApiData;
export const sliceDataFilterNotPage = (state) =>
  state.inventoriesChild.dataFilterNotPag;
export const sliceIsLoading = (state) => state.inventoriesChild.isLoading;
export const sliceIsExpandAll = (state) => state.inventoriesChild.isExpandedAll;
export const sliceRowExpand = (state) => state.inventoriesChild.rowExpand;
export const sliceCurrentPage = (state) => state.inventoriesChild.currentPage;
export const sliceRowsPerPage = (state) => state.inventoriesChild.rowsPerPage;
export const sliceTotalRow = (state) => state.inventoriesChild.totalRow;

export default inventoriesChildSlice.reducer;
