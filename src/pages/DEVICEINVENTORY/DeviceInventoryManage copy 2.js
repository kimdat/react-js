import React, { useState, useRef, useCallback, useEffect } from "react";

import Swale from "sweetalert2";
import { api } from "../../Interceptor";

import { MDBCardHeader, MDBContainer } from "mdb-react-ui-kit";

import { MDBCard } from "mdb-react-ui-kit";
import { MDBCardBody } from "mdb-react-ui-kit";
import ExportExcel from "../../components/ExportExcel/ExportExcel";
import DeleteRow from "../../components/DeleteRow/deleteRow";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import InventoriesComponent from "../../components/InventoriesComponent/InventoriesComponent";
import ImportFile from "./../../components/ImportFile/ImportFile";
import { debounce } from "lodash";
import { fetchData } from "./DeviceInventoryAction";
import { useDispatch, useSelector } from "react-redux";
const API_URL = api.defaults.baseURL;
const Inventories = React.memo(({ flagOffline = false }) => {
  if (flagOffline) {
    api.defaults.headers.common["flagOffline"] = true;
  }
  console.log("iv");

  const dispatch = useDispatch();
  const apiData = useSelector((state) => state.deviceInventory.data);

  useEffect(() => {
    try {
      dispatch(fetchData("devices"));
    } catch (err) {
      console.log(err.response);
      const message = err?.response?.data?.error ?? err?.error ?? err;
      Swale.fire({
        icon: "error",
        text: `Error when fetchData() ${message}`,
      });
    }
  }, [dispatch]);

  return (
    <div>
      {apiData && <InventoriesChild data={apiData} flagOffline={flagOffline} />}
    </div>
  );
});

const InventoriesChild = React.memo((props) => {
  const { data, flagOffline } = props;
  const [searchApiData, setSearchApiData] = useState(data.inventories);

  const [isExpandedAll, setIsExpandedAll] = useState([]);
  const filterTextRef = useRef("");
  const inputRef = useRef({});
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageRef = useRef(10);
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
      try {
        setCheckedRows(
          searchApiData.map(({ id, Name }) => ({ id: id, name: Name }))
        );
      } catch (error) {
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
  //api lấy data khi expand all
  const getExpandAll = useCallback(async () => {
    // gọi API để lấy dữ liệu con
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("searchapidata", JSON.stringify(searchApiData));
      const urlFilterData = `${API_URL}expandAll`;
      const { data } = await api.post(urlFilterData, formData);
      if (data.Err) {
        throw data.Err;
      }
      setIsLoading(false);
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
        console.log(data);
        return data;
      } catch (err) {
        setIsLoading(false);
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
      setIsLoading(true);
      const data = await apiFilterData(
        valueSearch,
        valueColumn,
        page,
        pageRows,
        flagShowChild
      );
      //Search theo No

      if (flagShowChild) {
        setIsExpandedAll(false);
        //RowExpand
        setRowExpand(data.row_expand);
      } else {
        setRowExpand([]);
      }
      //data
      updateState(data.total_records, data.searchapidata, data.devices);

      setIsLoading(false);
    },
    [apiFilterData, updateState]
  );
  const loadDataChild = useCallback(async () => {
    try {
      const { data } = await api.get(API_URL + "devices");
      setRowExpand([]);
      updateState(data.total_row, data.inventories, data.devices);
      setCurrentPage(1);
    } catch (err) {
      swaleError(err, "loadDataChild() ");
    }
  }, [swaleError, updateState]);
  const debouncedPageChange = useRef(null);

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      if (!debouncedPageChange.current) {
        debouncedPageChange.current = debounce((page) => {
          dataFilter(
            filterTextRef.current,
            inputRef.current,
            page,
            rowsPerPageRef.current,
            !isExpandedAll
          );
          debouncedPageChange.current = null;
        }, 200);
      }
      debouncedPageChange.current(page); // Gọi hàm debounce
    },
    [dataFilter, isExpandedAll]
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    rowsPerPageRef.current = newRowsPerPage;
    const totalPages = Math.ceil(totalRow / newRowsPerPage);
    //let newCurrentPage = currentPage > totalPages;
    if (currentPage > totalPages) {
      setCurrentPage(1);
      return;
    }
    //nếu current page lớn hơn totalpage thì page là 1

    //nếu current page lớn hơn totalpage thì page là 1
    dataFilter(
      filterTextRef.current,
      inputRef.current,
      currentPage,
      newRowsPerPage,
      !isExpandedAll
    );
  };

  //search text
  const handleFilter = useCallback(
    async (e) => {
      if (e.key !== "Enter") {
        return;
      }

      const valueSearch = e.target.value;
      if (
        valueSearch.trim().toLowerCase() ===
        filterTextRef.current.trim().toLowerCase()
      )
        return;
      filterTextRef.current = valueSearch;
      //nếu currentpage không phải trang đầu thì quay về trang đâ
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
      dataFilter(valueSearch, inputRef.current);
    },
    [dataFilter, currentPage]
  );
  //search column
  const handleFilterColumn = useCallback(
    async (e) => {
      if (e.key !== "Enter") {
        return;
      }

      const name = e.target.name;
      const value = e.target.value.trim();
      const newInputs = { ...inputRef.current, [name]: value };
      if (
        JSON.stringify(inputRef.current).toLowerCase() ===
        JSON.stringify(newInputs).toLowerCase()
      )
        return;
      inputRef.current = newInputs;
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
      dataFilter(filterTextRef.current, newInputs);
    },
    [dataFilter, currentPage]
  );

  return (
    <MDBContainer fluid>
      <MDBCard className="bg-white my-5 mx-auto" style={{ position: "static" }}>
        <MDBCardHeader style={{ textAlign: "center" }}>
          DEVICE INVENTORY
        </MDBCardHeader>
        <MDBCardBody>
          <div style={{ display: "flex", float: "right" }}>
            {flagOffline && <ImportFile loadData={loadDataChild} />}
            <ExportExcel
              row={dataFilterNotPag}
              setIsLoading={setIsLoading}
              flagOffline={flagOffline}
              endPoint="exportFileExcel"
            />
            {flagOffline && (
              <DeleteRow loadData={loadDataChild} rowsId={checkedRows} />
            )}
          </div>
          <div>
            <LoadingComponent isLoading={isLoading}>
              {searchApiData.length > 0 && (
                <div className="manageDeviceInventory">
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
                    rowsPerPage={rowsPerPageRef.current}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    setIsLoading={setIsLoading}
                    searchApiData={searchApiData}
                    setSearchApiData={setSearchApiData}
                    isExpandedAll={isExpandedAll}
                    setIsExpandedAll={setIsExpandedAll}
                    rowExpand={rowExpand}
                    setRowExpand={setRowExpand}
                  />
                </div>
              )}
            </LoadingComponent>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
});
export default Inventories;
