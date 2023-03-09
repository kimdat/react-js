import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCardBody } from "mdb-react-ui-kit";
import InventoriesComponent from "../../components/InventoriesComponent/InventoriesComponent";

import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import "./InventoriesOnline.css";
//lấy data trang đầu
function filterData(data) {
  return data.slice(0, 10);
}
//những hàng được expand
function rowExpandData(data) {
  return data.map((item) => item.id);
}

const InventoriesComponentOnline = React.memo(({ data }) => {
  const [rowExpand, setRowExpand] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  //số row mỗi page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //tổng row
  const [totalRow] = useState(data.length);
  //Mở rộng hết
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  //Hàm loading
  const [isLoading, setIsLoading] = useState(false);
  const handlePageChange = () => {};
  const handleRowsPerPageChange = () => {};
  useEffect(() => {
    setRowExpand(rowExpandData(data));
    setSearchApiData(filterData(data));
  }, [data]);
  return (
    <div>
      {data.length > 0 && (
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
