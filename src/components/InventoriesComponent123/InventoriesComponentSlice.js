import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import store from "../../app/store";
import { inventoriesChildSlice } from "../../pages/DEVICEINVENTORY/inventoryChildSlice";
import { useCallback } from "react";

const initialState = {};

export const inventoriesComponentSlice = createSlice({
  name: "inventoriesComponent",
  initialState,
  reducers: {
    handleSliceToggleRowDetails: async (state, action) => {
      const { searchApiData, row, getChildren, rowExpand } = action.payload;

      const newSearchApiData = [...searchApiData];
      const rowIndex = newSearchApiData.findIndex((item) => item.id === row.id);
      const rowData = newSearchApiData[rowIndex];
      const payload = {
        searchApiData: state.searchApiData,
        row,
        getChildren,
        rowExpand,
      };
      state.dataExpandSearch = "123";
      //nếu chưa có chldren thì gọi api để thêm
      if (!rowData.hasOwnProperty("children")) {
        const newChildren = await getChildren(rowData);
        const updatedRowData = { ...rowData, children: newChildren };
        newSearchApiData[rowIndex] = updatedRowData;
        state.dataExpandSearch = newSearchApiData;
        //state.dataExpandRow=data
        //setSearchApiData(newSearchApiData);
      }

      if (rowExpand.some((item) => item === row.id)) {
        // setRowExpand(rowExpand.filter((rowId) => rowId !== row.id));
      } else {
        //setRowExpand([])
      }
    },

    handleSliceExpandAll: async (state, action) => {
      const {
        searchApiData,
        isExpandedAll,
        getExpandAll,
        setSearchApiData,
        setRowExpand,
        setIsExpandedAll,
      } = action.payload;
      console.log(action);
      if (!searchApiData[0].hasOwnProperty("statusNotFound")) {
        if (!isExpandedAll) {
          setRowExpand([]);
        } else {
          //kiểm tra tất cả đều có has children
          const hasChildren = searchApiData.every((item) =>
            item.hasOwnProperty("children")
          );
          if (!hasChildren) {
            const data = await getExpandAll();
            setSearchApiData(data);
          }
          setRowExpand(
            searchApiData.map((row) => {
              return row.id;
            })
          );
        }
      }
      setIsExpandedAll(!isExpandedAll);
    },
  },

  //...
});

export const { handleSliceExpandAll, handleSliceToggleRowDetails } =
  inventoriesComponentSlice.actions;

export default inventoriesComponentSlice.reducer;
