import React, { useState, useEffect, useCallback } from "react";
import { MDBContainer, MDBRow, MDBCardBody } from "mdb-react-ui-kit";
import InventoriesComponent from "../../components/InventoriesComponent/InventoriesComponent";
import { api } from "../../Interceptor";
import { Swale } from "sweetalert2";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import "./InventoriesOnline.css";
const API_URL = api.defaults.baseURL;
const InventoriesOnline = () => {
  const [searchApiData, setSearchApiData] = useState([]);
  const [isExpandedAll, setIsExpandedAll] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRow, setToTalRow] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  //Data chưa phân trang
  const [dataFilterNotPag, setDataFilterNotPag] = useState([]);
  //Thông báo lỗi
  const swaleError = useCallback((err, nameFunction) => {
    console.log(err);
    const message = err?.response?.data?.error ?? err?.error ?? err;
    Swale.fire({
      icon: "error",
      text: `Error ${nameFunction} ${message}`,
    });
  }, []);
  const loadData = useCallback(async () => {
    try {
      const { data } = await api.get(API_URL + "devices");
      setToTalRow(data.total_row);
      setSearchApiData(data.inventories);
      setDataFilterNotPag(data.devices);
      setCurrentPage(1);
      setRowsPerPage(10);
    } catch (err) {
      swaleError(err, "loadData() ");
    }
  }, [swaleError]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const getChildren = () => {};
  const getExpandAll = () => {};
  const handlePageChange = () => {};
  const handleRowsPerPageChange = () => {};
  return (
    <LoadingComponent isLoading={isLoading}>
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCardBody>
            <InventoriesComponent
              getChildren={getChildren}
              getExpandAll={getExpandAll}
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
            />
          </MDBCardBody>
        </MDBRow>
      </MDBContainer>
    </LoadingComponent>
  );
};
export default InventoriesOnline;
