import { inventoriesComponentSlice } from "../components/InventoriesComponent/InventoriesComponentSlice";
import { checkSlice } from "../pages/DEVICEINVENTORY/InventoryCheckSlice";
import { inventoriesChildSlice } from "../pages/DEVICEINVENTORY/inventoryChildSlice";

const commonReducer = {
  inventoriesChild: inventoriesChildSlice.reducer,
  check: checkSlice.reducer,
  inventoriesComponent: inventoriesComponentSlice.reducer,
};

export default commonReducer;
