import { checkSlice } from "./InventoryCheckSlice";
import { inventoriesChildSlice } from "./inventoryChildSlice";

const deviceInventoryReducer = {
  inventoriesChild: inventoriesChildSlice.reducer,
  check: checkSlice.reducer,
};

export default deviceInventoryReducer;
