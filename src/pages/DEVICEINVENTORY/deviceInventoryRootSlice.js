import { deviceInventorySlice } from "./deviceInventorySlice";
import { checkSlice } from "./InventoryCheckSlice";
import { inventoriesChildSlice } from "./inventoryChildSlice";

const deviceInventoryRootReducer = {
  inventoriesChild: inventoriesChildSlice.reducer,
  check: checkSlice.reducer,
  deviceInventory: deviceInventorySlice.reducer,
};

export default deviceInventoryRootReducer;
