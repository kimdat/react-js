import React, { useState, useCallback } from "react";

import InventoriesComponent from "../../../../components/InventoriesComponent/InventoriesComponent";

import LoadingComponent from "../../../../components/LoadingComponent/LoadingComponent";
import "./InventoriesOnline.css";

import ExportExcel from "../../../../components/ExportExcel/ExportExcel";
import UpdateInventories from "./components/UpdateInventories/UpdateInventories";

const InventoriesComponentOnline = React.memo((props) => {
  const {
    searchApiData,
    setSearchApiData,
    totalRow,
    rowExpand,
    setRowExpand,
    dataAll,
    children,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  //số row mỗi page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //Mở rộng hết
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  //Hàm loading
  const [isLoading, setIsLoading] = useState(false);

  const handleDatatable = useCallback(
    (currentPage, rowsPerPage) => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      setSearchApiData(dataAll.slice(start, end));
    },
    [dataAll, setSearchApiData]
  );

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      handleDatatable(page, rowsPerPage);
    },
    [handleDatatable, rowsPerPage]
  );
  const handleRowsPerPageChange = useCallback(
    (data) => {
      setRowsPerPage(data);
      const totalPages = totalRow / data;
      handleDatatable(currentPage > totalPages ? 1 : currentPage, data);
    },
    [handleDatatable, currentPage, totalRow]
  );

  return (
    <div className="InventoriesComponentOnline">
      {searchApiData.length > 0 && (
        <LoadingComponent isLoading={isLoading}>
          <div style={{ display: "flex", float: "right" }}>
            <UpdateInventories
              setIsLoading={setIsLoading}
              children={children}
              data={dataAll}
            />
            <ExportExcel
              setIsLoading={setIsLoading}
              row={dataAll}
              endPoint="exportFileExcelSSH"
            />
          </div>
          <InventoriesComponent
            totalRow={totalRow}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            handleRowsPerPageChange={handleRowsPerPageChange}
            setIsLoading={setIsLoading}
            searchApiData={searchApiData}
            setSearchApiData={setSearchApiData}
            isExpandedAll={isExpandedAll}
            setIsExpandedAll={setIsExpandedAll}
            rowExpand={rowExpand}
            setRowExpand={setRowExpand}
          />
        </LoadingComponent>
      )}
    </div>
  );
});
export default InventoriesComponentOnline;
