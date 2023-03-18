import React, { useState, useCallback } from "react";

import InventoriesComponent from "../../../../components/InventoriesComponent/InventoriesComponent";

import LoadingComponent from "../../../../components/LoadingComponent/LoadingComponent";
import "./InventoriesOnline.css";
import ExcelSSH from "../ExcelSSH/ExcelSSH";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setIsLoading,
  setRowsPerPage,
  setSearchApiData,
  sliceCurrentPage,
  sliceDataFilterNotPage,
  sliceIsLoading,
  sliceRowsPerPage,
  sliceTotalRow,
} from "./../../../DEVICEINVENTORY/inventoryChildSlice";

const InventoriesComponentOnline = React.memo(() => {
  console.log("invcomponentchild1");
  const dispatch = useDispatch();
  const dataAll = useSelector(sliceDataFilterNotPage);
  const rowsPerPage = useSelector(sliceRowsPerPage);
  const currentPage = useSelector(sliceCurrentPage);
  const totalRow = useSelector(sliceTotalRow);
  const isLoading = useSelector(sliceIsLoading);
  const handleDatatable = useCallback(
    (currentPage, rowsPerPage) => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      dispatch(setSearchApiData(dataAll.slice(start, end)));
    },
    [dataAll, dispatch]
  );

  const handlePageChange = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
      handleDatatable(page, rowsPerPage);
    },
    [handleDatatable, rowsPerPage, dispatch]
  );
  const handleRowsPerPageChange = useCallback(
    (data) => {
      dispatch(setRowsPerPage(data));
      const totalPages = totalRow / data;
      handleDatatable(currentPage > totalPages ? 1 : currentPage, data);
    },
    [handleDatatable, currentPage, totalRow, dispatch]
  );

  return (
    <div className="InventoriesComponentOnline">
      {dataAll.length > 0 && (
        <div>
          <div style={{ float: "right" }}>
            <ExcelSSH
              setIsLoading={(isLoading) => dispatch(setIsLoading(isLoading))}
              row={dataAll}
            />
          </div>
          <InventoriesComponent
            handlePageChange={handlePageChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}
    </div>
  );
});
export default InventoriesComponentOnline;
