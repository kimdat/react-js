import { createSlice, current } from "@reduxjs/toolkit";
import { pageSizes } from "./data/constants";
import { deviceApiSlice } from "./deviceApiSlice";

const initialState = {
  list: [],
  isSelectAll: false,
  filters: {
    currentPage: 1,
    rowsPerPage: pageSizes[0],
  },
  totalRowCount: 0,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    selectAllToggle: (state, action) => {
      state.isSelectAll = !state.isSelectAll;
      state.list = state.list.map((device) => {
        return { ...device, isSelected: state.isSelectAll };
      });
    },
    selectRowToggle: (state, action) => {
      state.list = state.list.map((device) => {
        if (current(device).Id === action.payload) {
          return { ...device, isSelected: !device.isSelected };
        } else {
          return device;
        }
      });
      const checkSelectAll = (devices) => {
        return devices.every((device) => device.isSelected === true);
      };
      const isSelectAll = checkSelectAll(state.list);
      state.isSelectAll = isSelectAll;
    },
    setRowsPerPage: (state, action) => {
      const rowsPerPage = action.payload;
      state.filters.rowsPerPage = rowsPerPage;
      state.filters.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      const currentPage = action.payload;
      state.filters.currentPage = currentPage;
    },
    setFilter: (state, action) => {
      const { filterName, filterValue } = action.payload;
      state.filters[filterName] = filterValue;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      deviceApiSlice.endpoints.getDevices.matchFulfilled,
      (state, action) => {
        const devices = action.payload.devices;
        state.list = devices?.map((device) => {
          return {
            ...device,
            isSelected: false,
          };
        });
        state.totalRowCount = action.payload.totalRowCount
      }
    );
  },
});

export const {
  selectAllToggle,
  selectRowToggle,
  setRowsPerPage,
  setCurrentPage,
  setFilter,
} = deviceSlice.actions;
export const selectDeviceList = (state) => state.device.list;
export const selectFilters = (state) => state.device.filters;
export const selectTotalRowCount = (state) => state.device.totalRowCount;

export default deviceSlice.reducer;
