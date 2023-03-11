import React, { useState, useRef, useCallback } from "react";

import Swale from "sweetalert2";
import { api } from "../../Interceptor";

import { MDBContainer } from "mdb-react-ui-kit";

import { MDBCard } from "mdb-react-ui-kit";
import { MDBCardBody } from "mdb-react-ui-kit";
import ExportExcel from "../../components/ExportExcel/ExportExcel";
import DeleteRow from "../../components/DeleteRow/deleteRow";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import InventoriesComponent from "../../components/InventoriesComponent/InventoriesComponent";
const ModalFileUpload = React.lazy(() =>
  import("../../components/ModalFileUpload/ModalFileUpload")
);
const API_URL = api.defaults.baseURL;

const Inventories = React.memo(({ flagOffline = false }) => {
  if (flagOffline) {
    api.defaults.headers.common["flagOffline"] = true;
  }
  const [apiData, setApiData] = useState(null);

  const loadData = React.useCallback(async () => {
    try {
      const { data } = await api.get(API_URL + "devices");
      console.log(data);
      setApiData(data);
    } catch (err) {
      console.log(err.response);
      Swale.fire({
        icon: "error",
        text: `Error when fetchData() ${err}`,
      });
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <div>
      {apiData ? (
        <InventoriesChild data={apiData} flagOffline={flagOffline} />
      ) : (
        <div>Loading data...</div>
      )}
    </div>
  );
});

const InventoriesChild = React.memo(({ data, flagOffline }) => {
  const [searchApiData, setSearchApiData] = useState(data.inventories);
  const [isExpandedAll, setIsExpandedAll] = useState([]);
  const filterTextRef = useRef("");
  const inputRef = useRef({});
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRow, setToTalRow] = useState(data.total_row);
  const [isLoading, setIsLoading] = useState(false);
  const [rowExpand, setRowExpand] = useState([]);
  //Data chưa phân trang
  const [dataFilterNotPag, setDataFilterNotPag] = useState(data.devices);
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
  console.log("inv");
  const loadDataChild = useCallback(async () => {
    try {
      const { data } = await api.get(API_URL + "devices");
      console.log(data);
      setRowExpand([]);
      updateState(data.total_row, data.inventories, data.devices);
      // setCurrentPage(1);
      //  setRowsPerPage(10);
    } catch (err) {
      swaleError(err, "loadDataChild() ");
    }
  }, [swaleError, updateState]);

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
      pageCurrent,
      pagePerRows,
      flagShowChild
    ) => {
      // gọi API để filter
      try {
        console.log("apifilterData");
        const urlFilterData = `${API_URL}filterData`;
        const params = {
          valueSearch: valueSearch,
          valueColumn: JSON.stringify(valueColumn),
          currentPage: pageCurrent,
          rowsPerPage: pagePerRows,
          flagShowChild: flagShowChild,
        };

        const { data } = await api.get(urlFilterData, { params });

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
      pageRows = 10,
      flagShowChild = true
    ) => {
      const data = await apiFilterData(
        valueSearch,
        valueColumn,
        page,
        pageRows,
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
      setCurrentPage(page);
      setRowsPerPage(pageRows);
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
    },
    [dataFilter, rowsPerPage, isExpandedAll]
  );

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage) => {
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
            {flagOffline && <ModalFileUpload loadData={loadDataChild} />}
            <ExportExcel
              row={dataFilterNotPag}
              setIsLoading={setIsLoading}
              flagOffline={flagOffline}
            />
            <DeleteRow loadData={loadDataChild} rowsId={checkedRows} />
          </div>
          <LoadingComponent isLoading={isLoading}>
            {searchApiData.length > 0 && (
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
            )}
          </LoadingComponent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
});
export default Inventories;
