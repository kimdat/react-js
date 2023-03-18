import React, { useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FilterColumn } from "../FilterColumn/FilterColumn";
import FilterComponent from "../FilterComponent/FilterComponent";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";
import "./Inventories.css";
import ExpandableRowLazyComponent from "../ExpandRowLazyComponent/ExpandRowLazyComponent";
import { useDispatch, useSelector } from "react-redux";

import {
  sliceIsExpandAll,
  setRowExpand,
  setSearchApiData,
  sliceRowExpand,
  sliceSearchApiData,
  setIsExpandedAll,
  sliceRowsPerPage,
  sliceCurrentPage,
  sliceTotalRow,
} from "../../pages/DEVICEINVENTORY/inventoryChildSlice";
import {
  sliceCheckAll,
  sliceCheckedRows,
} from "../../pages/DEVICEINVENTORY/InventoryCheckSlice";

const InventoriesComponent = React.memo(
  ({
    handleCheckAll = () => {},
    handleCheck = () => {},
    getChildren = () => {},
    getExpandAll = () => {},
    handleFilterColumn = () => {},
    handleFilter = () => {},
    handlePageChange = () => {},
    handleRowsPerPageChange = () => {},
  }) => {
    const dispatch = useDispatch();
    const searchApiData = useSelector(sliceSearchApiData);
    const rowExpand = useSelector(sliceRowExpand);
    const isExpandedAll = useSelector(sliceIsExpandAll);
    const checkedRows = useSelector(sliceCheckedRows);
    const checkAll = useSelector(sliceCheckAll);
    const totalRow = useSelector(sliceTotalRow);
    const currentPage = useSelector(sliceCurrentPage);
    const rowsPerPage = useSelector(sliceRowsPerPage);

    //xử lý đóng/mở  con từng dòng
    const toggleRowDetails = useCallback(
      async (row) => {
        const newSearchApiData = [...searchApiData];
        const rowIndex = newSearchApiData.findIndex(
          (item) => item.id === row.id
        );
        const rowData = newSearchApiData[rowIndex];

        //nếu chưa có chldren thì gọi api để thêm
        if (!rowData.hasOwnProperty("children")) {
          const newChildren = await getChildren(rowData);
          const updatedRowData = { ...rowData, children: newChildren };
          newSearchApiData[rowIndex] = updatedRowData;
          console.log(newSearchApiData);
          dispatch(setSearchApiData(newSearchApiData));
        }

        if (rowExpand.some((item) => item === row.id)) {
          dispatch(setRowExpand(rowExpand.filter((rowId) => rowId !== row.id)));
        } else {
          dispatch(setRowExpand([...rowExpand, row.id]));
        }
      },
      [searchApiData, getChildren, rowExpand, dispatch]
    );

    //xử lý khi mở rộng all
    const handleExpandAll = useCallback(async () => {
      if (!searchApiData[0].hasOwnProperty("statusNotFound")) {
        if (!isExpandedAll) {
          dispatch(setRowExpand([]));
        } else {
          //kiểm tra tất cả đều có has children
          const hasChildren = searchApiData.every((item) =>
            item.hasOwnProperty("children")
          );
          if (!hasChildren) {
            const data = await getExpandAll();
            dispatch(setSearchApiData(data));
          }
          dispatch(
            setRowExpand(
              searchApiData.map((row) => {
                return row.id;
              })
            )
          );
        }
      }
      dispatch(setIsExpandedAll(!isExpandedAll));
    }, [dispatch, isExpandedAll, searchApiData, getExpandAll]);
    //cột columm kèm thông tin filter
    const createColumnChildToFilter = useCallback(
      (columnName, width, nameTitle) => {
        return {
          name: (
            <FilterColumn
              width={width}
              column={columnName}
              nameTitle={nameTitle}
              handleFilterColumn={handleFilterColumn}
            ></FilterColumn>
          ),
          style: { display: "none" },
          width: width === "" ? undefined : width,
        };
      },
      [handleFilterColumn]
    );

    const columns = useMemo(
      () => [
        {
          name: (
            <input
              className="inputCheckbox"
              type="checkbox"
              checked={checkAll}
              onChange={handleCheckAll}
            />
          ),
          cell: (row) =>
            !row.hasOwnProperty("statusNotFound") && (
              <div>
                <input
                  className="inputCheckbox"
                  type="checkbox"
                  checked={checkedRows.some((item) => item.id === row.id)}
                  onChange={() => handleCheck(row)}
                />
              </div>
            ),
          width: "45px",
        },
        {
          name: "NO",
          selector: (row) => row.STT,
          width: "60px",
        },
        {
          name: (
            <FilterColumn
              column="Name"
              nameTitle="Device Name"
              handleFilterColumn={handleFilterColumn}
            ></FilterColumn>
          ),
          cell: (row) => {
            if (row.hasOwnProperty("statusNotFound")) {
              return <div>There are no record</div>;
            }
            return (
              <div>
                <Button
                  style={{ padding: "0px" }}
                  variant="link"
                  onClick={() => toggleRowDetails(row)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {rowExpand.some((item) => item === row.id) ? (
                      <FontAwesomeIcon icon={faChevronDown} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronRight} />
                    )}
                    <div style={{ color: "black", paddingLeft: "5px" }}>
                      {row.Name}
                    </div>
                  </div>
                </Button>
              </div>
            );
          },
          conditionalCellStyles: [
            {
              when: (row) => row.hasOwnProperty("statusNotFound"),
              style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold", // example of additional styles
              },
            },
            {
              when: (row) => !row.hasOwnProperty("statusNotFound"),
            },
          ],
        },
        createColumnChildToFilter("InventoriesName", "", "SLOT"),
        createColumnChildToFilter("PID", "", "PID"),
        createColumnChildToFilter("Serial", "", "Serial"),
        createColumnChildToFilter("CDESC", "45%", "DESCRIPTION"),
      ],
      [
        handleFilterColumn,
        toggleRowDetails,
        checkAll,
        handleCheckAll,
        checkedRows,
        handleCheck,
        createColumnChildToFilter,
        rowExpand,
      ]
    );
    const expandableRowsComponent = useCallback(
      ({ data: { children } }) => <ExpandableRowLazyComponent row={children} />,
      []
    );
    return (
      <div>
        <div>
          <Button
            style={{
              with: "100%",
              maxWidth: "200px",
            }}
            variant={isExpandedAll ? "success" : "secondary"}
            onClick={handleExpandAll}
          >
            {!isExpandedAll ? (
              <>
                <FaAngleDoubleDown /> Close All
              </>
            ) : (
              <>
                <FaAngleDoubleRight /> Expand All
              </>
            )}
          </Button>

          <FilterComponent onFilter={handleFilter} />
        </div>
        <div className="table-container">
          <DataTable
            style={{ width: "100%", tableLayout: "auto" }}
            highlightOnHover
            paginationDefaultPage={currentPage}
            paginationTotalRows={totalRow}
            paginationPerPage={rowsPerPage}
            columns={columns}
            data={searchApiData}
            expandableRows
            pagination
            paginationServer
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            expandableRowsHideExpander
            expandableRowExpanded={(row) =>
              rowExpand.some((item) => item === row.id)
            }
            responsive={true}
            dense={true}
            expandableRowsComponent={expandableRowsComponent}
            className="my-custom-data-table"
            striped
          />
        </div>
      </div>
    );
  }
);
export default InventoriesComponent;
