import React, { useState, useEffect, useCallback } from "react";
import { MDBContainer, MDBRow, MDBCardBody } from "mdb-react-ui-kit";
import InventoriesComponent from "../../components/InventoriesComponent/InventoriesComponent";

import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import "./InventoriesOnline.css";

const InventoriesComponentOnline = React.memo(({ apiData }) => {
  const [rowExpand, setRowExpand] = useState([]);
  //datapage hiện tại
  const [searchApiData, setSearchApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  //số row mỗi page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //tổng row
  const [totalRow, setToTalRow] = useState(0);
  //Mở rộng hết
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  //Hàm loading
  const [isLoading, setIsLoading] = useState(false);
  //tổng data
  const [dataAll, setDataAll] = useState([]);
  useEffect(() => {
    setSearchApiData(apiData.dataShow);
    setRowExpand(apiData.row_expand);
    setToTalRow(apiData.total_row);
    setDataAll(apiData.data);
  }, [apiData]);
  const handleDatatable = useCallback(
    (currentPage, rowsPerPage) => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      setSearchApiData(dataAll.slice(start, end));
    },
    [dataAll]
  );
  console.log("iv");
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
      handleDatatable(currentPage, data);
    },
    [handleDatatable, currentPage]
  );

  return (
    <div>
      {searchApiData.length > 0 && (
        <LoadingComponent isLoading={isLoading}>
          <MDBContainer fluid>
            <MDBRow className="d-flex justify-content-center align-items-center h-100">
              <MDBCardBody>
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
              </MDBCardBody>
            </MDBRow>
          </MDBContainer>
        </LoadingComponent>
      )}
    </div>
  );
});
export default InventoriesComponentOnline;
