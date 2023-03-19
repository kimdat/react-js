import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import deviceReducer from "../features/devices/deviceSlice";
import deviceInventoryRootReducer from "../pages/DEVICEINVENTORY/deviceInventoryRootSlice";
import RootPageReducer from "../pages/RootPageReducer";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    device: deviceReducer,
    ...RootPageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: true,
});

export default store;
