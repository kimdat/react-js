import {deviceInventorySlice} from "./DEVICEINVENTORY/deviceInventorySlice";

const RootPageReducer = {
  deviceInventory: deviceInventorySlice.reducer,
};

export default RootPageReducer;
