import React, { useCallback, memo, useEffect, useRef } from "react";
import ExportExcel from "../../components/ExportExcel/ExportExcel";
import DeleteRow from "../../components/DeleteRow/deleteRow";

import Swale from "sweetalert2";
import ImportFile from "./../../components/ImportFile/ImportFile";

import { useDispatch, useSelector } from "react-redux";
import {
  setApiData,
  setCurrentPage,
  setDataFilterNotPag,
  setIsLoading,
  setRowExpand,
  setRowsPerPage,
  setSearchApiData,
  setTotalRow,
  sliceApiData,
  sliceCurrentPage,
  sliceDataFilterNotPage,
  sliceIsExpandAll,
  sliceIsLoading,
  sliceRowsPerPage,
  sliceSearchApiData,
  sliceTotalRow,
} from "./inventoryChildSlice";
import {
  handleCheck,
  handleCheckAll,
  setCheckAll,
  setCheckedRows,
  sliceCheckedRows,
} from "./InventoryCheckSlice";
import { api } from "../../Interceptor";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBContainer,
} from "mdb-react-ui-kit";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import InventoriesComponent from "./../../components/InventoriesComponent/InventoriesComponent";
import { debounce } from "lodash";

//Thông báo lỗi
export const swaleError = (err, nameFunction) => {
  console.log(err);
  const message = err?.response?.data?.error ?? err?.error ?? err;
  Swale.fire({
    icon: "error",
    text: `Error ${nameFunction} ${message}`,
  });
};
const API_URL = api.defaults.baseURL;
const Inventories = memo(({ flagOffline = false }) => {
  if (flagOffline) {
    api.defaults.headers.common["flagOffline"] = true;
  }
  const dispatch = useDispatch();

  const apiData = useSelector(sliceApiData);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get(API_URL + "devices");
        dispatch(setApiData(data));
        dispatch(setSearchApiData(data.inventories));
        dispatch(setTotalRow(data.total_row));
        dispatch(setDataFilterNotPag(data.devices));
      } catch (err) {
        console.log(err.response);
        const message = err?.response?.data?.error ?? err?.error ?? err;
        Swale.fire({
          icon: "error",
          text: `Error when fetchData() ${message}`,
        });
      }
    };
    loadData();
  }, [dispatch]);

  return (
    <div>
      {apiData != null && <InventoriesChild flagOffline={flagOffline} />}
    </div>
  );
});

const InventoriesChild = React.memo(({ flagOffline }) => {
  const searchApiData = useSelector(sliceSearchApiData);
  const checkedRows = useSelector(sliceCheckedRows);
  const dataFilterNotPag = useSelector(sliceDataFilterNotPage);
  const dispatch = useDispatch();
  const isLoading = useSelector(sliceIsLoading);
  const isExpandedAll = useSelector(sliceIsExpandAll);
  const totalRow = useSelector(sliceTotalRow);
  const currentPage = useSelector(sliceCurrentPage);
  const rowsPerPage = useSelector(sliceRowsPerPage);
  const filterTextRef = useRef("");
  const inputRef = useRef({});
  const isSearchRef = useRef(false);

  //Hàm chọn check All
  const handleCheckAllFnc = useCallback(() => {
    const checkAll = dispatch(handleCheckAll({ searchApiData }));
    console.log(checkAll);
  }, [dispatch, searchApiData]);
  //check từng dòng
  const handleCheckfnc = useCallback(
    (row) => {
      dispatch(handleCheck({ row, checkedRows }));
    },
    [dispatch, checkedRows]
  );
  const updateState = useCallback(
    (total_row, inventories, devices) => {
      //tổng row
      dispatch(setTotalRow(total_row));
      //data show trong trang
      dispatch(setSearchApiData(inventories));
      //data all
      dispatch(setDataFilterNotPag([devices]));
      //bỏ checkrow
      dispatch(setCheckedRows([]));
      //bỏ checkbox checkall
      dispatch(setCheckAll([]));
    },
    [dispatch]
  );

  const loadDataChild = useCallback(async () => {
    try {
      const { data } = await api.get(API_URL + "devices");
      console.log(data);
      dispatch(setRowExpand([]));
      updateState(data.total_row, data.inventories, data.devices);
    } catch (err) {
      swaleError(err, "loadDataChild() ");
    }
  }, [updateState, dispatch]);
  const getExpandAll = async () => {
    // gọi API để lấy dữ liệu con
    try {
      dispatch(setIsLoading(true));
      const formData = new FormData();
      formData.append("searchapidata", JSON.stringify(searchApiData));
      const urlFilterData = `${API_URL}expandAll`;
      const { data } = await api.post(urlFilterData, formData);
      if (data.Err) {
        throw data.Err;
      }
      dispatch(setIsLoading(false));
      return data;
    } catch (err) {
      dispatch(setIsLoading(false));
      swaleError(err, "getExpandAll() ");
    }
  };
  //api lấy từng thằng con
  const getChildren = async (row) => {
    // gọi API để lấy dữ liệu con
    const id = row.id;
    try {
      const { data } = await api.get(`${API_URL}childDevice?id=${id}`);

      return data;
    } catch (err) {
      swaleError(err, "getChildren() ");
    }
  };
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
        swaleError(err, "apiFilterData() ");
      }
    },
    []
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
      dispatch(setIsLoading(true));
      try {
        const data = await apiFilterData(
          valueSearch,
          valueColumn,
          page,
          pageRows,
          flagShowChild
        );
        if (flagShowChild) {
          //RowExpand
          dispatch(setRowExpand(data.row_expand));
        } else {
          dispatch(setRowExpand([]));
        }
        //data
        updateState(data.total_records, data.searchapidata, data.devices);
        dispatch(setCurrentPage(page));
        dispatch(setRowsPerPage(pageRows));
        dispatch(setIsLoading(false));
      } catch (error) {
        dispatch(setIsLoading(false));
        swaleError(error, "filderData");
      }
    },
    [apiFilterData, updateState, dispatch]
  );
  const debouncedPageChange = useRef(null);

  const handlePageChange = useCallback(
    (page) => {
      if (isSearchRef.current) {
        isSearchRef.current = false;
        return;
      }
      if (!debouncedPageChange.current) {
        debouncedPageChange.current = debounce((page) => {
          dataFilter(
            filterTextRef.current,
            inputRef.current,
            page,
            rowsPerPage,
            !isExpandedAll
          );
          debouncedPageChange.current = null;
        }, 500);
      }
      debouncedPageChange.current(page); // Gọi hàm debounce
    },
    [dataFilter, rowsPerPage, isExpandedAll]
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    if (isSearchRef.current) {
      isSearchRef.current = false;
      return; // Nếu là search thì không thực hiện gọi hàm dataFilter
    }
    const totalPages = Math.ceil(totalRow / newRowsPerPage);
    //nếu current page lớn hơn totalpage thì page là 1
    dataFilter(
      filterTextRef.current,
      inputRef.current,
      currentPage > totalPages ? 1 : currentPage,
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
      isSearchRef.current = true;
      const valueSearch = e.target.value;
      if (
        valueSearch.trim().toLowerCase() ===
        filterTextRef.current.trim().toLowerCase()
      )
        return;
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
      isSearchRef.current = true;
      const name = e.target.name;
      const value = e.target.value.trim();
      const newInputs = { ...inputRef.current, [name]: value };
      if (
        JSON.stringify(inputRef.current).toLowerCase() ===
        JSON.stringify(newInputs).toLowerCase()
      )
        return;
      inputRef.current = newInputs;
      dataFilter(filterTextRef.current, newInputs);
    },
    [dataFilter]
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
              setIsLoading={(isLoading) => dispatch(setIsLoading(isLoading))}
              flagOffline={flagOffline}
            />
            <DeleteRow loadData={loadDataChild} rowsId={checkedRows} />
          </div>
          <div>
            <LoadingComponent isLoading={isLoading}>
              {searchApiData.length > 0 && (
                <div className="manageDeviceInventory">
                  <InventoriesComponent
                    handleCheckAll={handleCheckAllFnc}
                    handleCheck={handleCheckfnc}
                    getChildren={getChildren}
                    getExpandAll={getExpandAll}
                    handleFilterColumn={handleFilterColumn}
                    handleFilter={handleFilter}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
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
