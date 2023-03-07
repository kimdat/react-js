import React, { useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FilterColumn } from "./../../components/FilterColumn/FilterColumn";
import FilterComponent from "./../../components/FilterComponent/FilterComponent";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";
import "./Inventories.css";
import ExpandableRowLazyComponent from "../../components/ExpandRowLazyComponent/ExpandRowLazyComponent";
const InventoriesComponent = React.memo(
  ({
    handleFilterColumn,
    handleFilter = () => {},
    checkAll = false,
    handleCheckAll = () => {},
    checkedRows = [],
    handleCheck = () => {},
    getChildren = () => {},
    getExpandAll = () => {},
    totalRow = 1,
    currentPage = 1,
    handlePageChange = () => {},
    rowsPerPage = 10,
    handleRowsPerPageChange = () => {},
    setIsLoading = false,
    searchApiData = [],
    setSearchApiData = () => {},
    isExpandedAll = false,
    setIsExpandedAll = () => {},
    rowExpand = [],
    setRowExpand = () => {},
  }) => {
    //xử lý đóng/mở  con từng dòng
    const toggleRowDetails = useCallback(
      async (row) => {
        const newSearchApiData = [...searchApiData];
        const rowIndex = newSearchApiData.findIndex(
          (item) => item.id === row.id
        );
        const rowData = newSearchApiData[rowIndex];
        if (rowExpand.some((item) => item === row.id)) {
          setRowExpand(rowExpand.filter((rowId) => rowId !== row.id));
        } else {
          setRowExpand([...rowExpand, row.id]);
        }
        //nếu chưa có chldren thì gọi api để thêm
        if (!rowData.hasOwnProperty("children")) {
          const newChildren = await getChildren(rowData);
          newSearchApiData[rowIndex].children = newChildren;
          setSearchApiData(newSearchApiData); // sử dụng setSearchApiData như một state updater function
        }
      },
      [searchApiData, getChildren, setSearchApiData, rowExpand, setRowExpand]
    );

    //xử lý khi mở rộng all
    const handleExpandAll = useCallback(async () => {
      if (!searchApiData[0].hasOwnProperty("statusNotFound")) {
        setIsLoading(true);
        if (!isExpandedAll) {
          setRowExpand([]);
        } else {
          setRowExpand(
            searchApiData.map((row) => {
              return row.id;
            })
          );
          //kiểm tra tất cả đều có has children
          const hasChildren = searchApiData.every((item) =>
            item.hasOwnProperty("children")
          );
          if (!hasChildren) {
            const data = await getExpandAll();
            setSearchApiData(data);
          }
        }
        setIsLoading(false);
      }
      setIsExpandedAll(!isExpandedAll);
    }, [
      setRowExpand,
      isExpandedAll,
      searchApiData,
      getExpandAll,
      setSearchApiData,
      setIsExpandedAll,
      setIsLoading,
    ]);
    //cột columm kèm thông tin filter
    const createColumnChildToFilter = useCallback(
      (columnName) => {
        return {
          name: (
            <FilterColumn
              column={columnName}
              handleFilterColumn={handleFilterColumn}
            ></FilterColumn>
          ),
          selector: (row) => row[columnName],
          style: { display: "none" },
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
          width: "50px",
        },
        {
          name: (
            <FilterColumn
              column="Name"
              handleFilterColumn={handleFilterColumn}
            ></FilterColumn>
          ),
          cell: (row) => {
            if (row.hasOwnProperty("statusNotFound")) {
              return <div>There are no record</div>;
            }
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button variant="link" onClick={() => toggleRowDetails(row)}>
                    {rowExpand.some((item) => item.id) ? (
                      <FontAwesomeIcon icon={faChevronDown} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronRight} />
                    )}
                  </Button>
                  {row.Name}
                </div>
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
          ],
        },
        createColumnChildToFilter("VID"),
        createColumnChildToFilter("Serial"),
        createColumnChildToFilter("PID"),
        createColumnChildToFilter("CDESC"),
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
      ({ data: { children, id } }) => {
        const shouldShowRow = rowExpand.includes(id);
        if (!shouldShowRow) {
          return null; // or <div />
        }

        return (
          <div>
            <ExpandableRowLazyComponent row={children} />
          </div>
        );
      },
      [rowExpand]
    );
    return (
      <div>
        <Button
          style={{
            with: "100%",
            maxWidth: "200px",
            marginTop: "20px",
            marginBottom: "10px",
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

        <DataTable
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
          expandableRowExpanded={(row) => {
            return true;
          }}
          expandableRowsComponent={expandableRowsComponent}
          className="my-custom-data-table"
          striped
          subHeader
          subHeaderComponent={
            <div>
              <FilterComponent onFilter={handleFilter} />
            </div>
          }
        />
      </div>
    );
  }
);
export default InventoriesComponent;
