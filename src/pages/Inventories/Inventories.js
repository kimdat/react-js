import React, { useState, useRef, useCallback, useEffect } from "react";

import Swale from "sweetalert2";
import { api } from "../../Interceptor";

import { MDBContainer } from "mdb-react-ui-kit";
import { ModalFileUpload } from "../../components/ModalFileUpload/ModalFileUpload";
import { MDBCard } from "mdb-react-ui-kit";
import { MDBCardBody } from "mdb-react-ui-kit";
import ExportExcel from "./../../components/ExportExcel/ExportExcel";
import DeleteRow from "./../../components/DeleteRow/deleteRow";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import InventoriesComponent from "./../../components/InventoriesComponent/InventoriesComponent";
const API_URL = api.defaults.baseURL;
const Inventories = React.memo(() => {
  const [searchApiData, setSearchApiData] = useState([]);
  const [isExpandedAll, setIsExpandedAll] = useState([]);
  const filterTextRef = useRef("");
  const inputRef = useRef({});
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRow, setToTalRow] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rowExpand, setRowExpand] = useState([]);
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
  //Hàm chọn check All
  const handleCheckAll = useCallback(async () => {
    setCheckAll(!checkAll);
    if (!checkAll) {
      setIsLoading(true);
      try {
        setCheckedRows(
          searchApiData.map(({ id, Name }) => ({ id: id, name: Name }))
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        swaleError(error, "handcheckall");
      }
    } else {
      setCheckedRows([]);
    }
  }, [checkAll, searchApiData, swaleError]);
  //check từng dòng
  const handleCheck = useCallback(
    (row) => {
      if (checkedRows.some((item) => item.id === row["id"])) {
        setCheckedRows(checkedRows.filter((rowId) => rowId["id"] !== row.id));
      } else {
        setCheckedRows([...checkedRows, { id: row.id, name: row.Name }]);
      }
    },
    [checkedRows]
  );
  const updateState = useCallback((total_row, inventories, devices) => {
    //tổng row
    setToTalRow(total_row);
    //data show trong trang
    setSearchApiData(inventories);
    //data tổng trang
    setDataFilterNotPag(devices);
    //bỏ checkrow
    setCheckedRows([]);
    //bỏ checkbox checkall
    setCheckAll(false);
  }, []);
  const loadData = useCallback(async () => {
    try {
      const { data } = await api.get(API_URL + "devices");
      setCurrentPage(1);
      setRowsPerPage(10);
      setRowExpand([]);
      updateState(data.total_row, data.inventories, data.devices);
    } catch (err) {
      swaleError(err, "loadData() ");
    }
  }, [swaleError, updateState]);
  console.log("inven");
  useEffect(() => {
    loadData();
  }, [loadData]);
  //api lấy data khi expand all
  const getExpandAll = useCallback(async () => {
    // gọi API để lấy dữ liệu con
    try {
      const formData = new FormData();
      formData.append("searchapidata", JSON.stringify(searchApiData));
      const urlFilterData = `${API_URL}expandAll`;
      const { data } = await api.post(urlFilterData, formData);
      if (data.Err) {
        throw data.Err;
      }
      console.log(data);
      return data;
    } catch (err) {
      setIsLoading(false);
      swaleError(err, "getExpandAll() ");
    }
  }, [searchApiData, swaleError]);
  //api lấy từng thằng con
  const getChildren = useCallback(
    async (row) => {
      // gọi API để lấy dữ liệu con
      console.log("api get children");
      const id = row.id;
      try {
        const { data } = await api.get(`${API_URL}childDevice?id=${id}`);

        return data;
      } catch (err) {
        swaleError(err, "getChildren() ");
      }
    },
    [swaleError]
  );
  //gọi api để filter
  const apiFilterData = useCallback(
    async (
      valueSearch,
      valueColumn,
      currentPage,
      rowsPerPage,
      flagShowChild
    ) => {
      // gọi API để filter
      try {
        const urlFilterData = `${API_URL}filterData`;
        const params = {
          valueSearch: valueSearch,
          valueColumn: JSON.stringify(valueColumn),
          currentPage: currentPage,
          rowsPerPage: rowsPerPage,
          flagShowChild: flagShowChild,
        };

        const { data } = await api.get(urlFilterData, { params });
        console.log(data);
        return data;
      } catch (err) {
        swaleError(err, "apiFilterData() ");
      }
    },
    [swaleError]
  );
  //hàm xử lý khi filter
  const dataFilter = useCallback(
    async (
      valueSearch,
      valueColumn,
      page = 1,
      rowsPerPage = 10,
      flagShowChild = true
    ) => {
      const data = await apiFilterData(
        valueSearch,
        valueColumn,
        page,
        rowsPerPage,
        flagShowChild
      );
      if (flagShowChild) {
        setIsExpandedAll(false);
        //RowExpand
        setRowExpand(data.row_expand);
      } else {
        setRowExpand([]);
      }
      //data
      updateState(data.total_records, data.searchapidata, data.devices);
    },
    [apiFilterData, updateState]
  );
  const handlePageChange = useCallback(
    (page) => {
      dataFilter(
        filterTextRef.current,
        inputRef.current,
        page,
        rowsPerPage,
        !isExpandedAll
      );
      setCurrentPage(page);
    },
    [dataFilter, rowsPerPage, isExpandedAll]
  );

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage) => {
      console.log(isExpandedAll);
      setRowsPerPage(newRowsPerPage);
      dataFilter(
        filterTextRef.current,
        inputRef.current,
        currentPage,
        newRowsPerPage,
        !isExpandedAll
      );
    },
    [dataFilter, currentPage, isExpandedAll]
  );
  //search text
  const handleFilter = useCallback(
    async (e) => {
      if (e.key !== "Enter") {
        return;
      }
      const valueSearch = e.target.value;
      filterTextRef.current = valueSearch;
      dataFilter(valueSearch, inputRef.current);
    },
    [dataFilter]
  );
  //search column
  const handleFilterColumn = useCallback(
    async (e) => {
      if (e.key !== "Enter") {
        return;
      }
      const name = e.target.name;
      const value = e.target.value;
      const newInputs = { ...inputRef.current, [name]: value };
      inputRef.current = newInputs;
      dataFilter(filterTextRef.current, newInputs);
    },
    [dataFilter]
  );

  return (
    <MDBContainer fluid>
      <MDBCard className="bg-white my-5 mx-auto" style={{ position: "static" }}>
        <MDBCardBody className="p-5 w-100 d-flex flex-column">
          <div style={{ display: "flex" }}>
            <ModalFileUpload loadData={loadData} />
            <ExportExcel row={dataFilterNotPag} setIsLoading={setIsLoading} />
            <DeleteRow
              setIsLoading={setIsLoading}
              loadData={loadData}
              data={searchApiData}
              rowsId={checkedRows}
              setSearchApiData={setSearchApiData}
              setCheckedRows={setCheckedRows}
            />
          </div>
          <LoadingComponent isLoading={isLoading}>
            <InventoriesComponent
              handleFilterColumn={handleFilterColumn}
              handleFilter={handleFilter}
              checkAll={checkAll}
              handleCheckAll={handleCheckAll}
              checkedRows={checkedRows}
              handleCheck={handleCheck}
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
              rowExpand={rowExpand}
              setRowExpand={setRowExpand}
            />
          </LoadingComponent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
});
export default Inventories;
