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
    // setIsLoading = false,
    searchApiData = [],
    setSearchApiData = () => {},
    isExpandedAll = false,
    setIsExpandedAll = () => {},
    rowExpand = [],
    setRowExpand = () => {},
  }) => {
    console.log("invComponent");
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
          newSearchApiData[rowIndex].children = newChildren;
          setSearchApiData(newSearchApiData); // sử dụng setSearchApiData như một state updater function
        }
        if (rowExpand.some((item) => item === row.id)) {
          setRowExpand(rowExpand.filter((rowId) => rowId !== row.id));
        } else {
          setRowExpand([...rowExpand, row.id]);
        }
      },
      [searchApiData, getChildren, setSearchApiData, rowExpand, setRowExpand]
    );

    //xử lý khi mở rộng all
    const handleExpandAll = useCallback(async () => {
      if (!searchApiData[0].hasOwnProperty("statusNotFound")) {
        if (!isExpandedAll) {
          setRowExpand([]);
        } else {
          //kiểm tra tất cả đều có has children
          const hasChildren = searchApiData.every((item) =>
            item.hasOwnProperty("children")
          );
          if (!hasChildren) {
            const data = await getExpandAll();
            setSearchApiData(data);
          }
          setRowExpand(
            searchApiData.map((row) => {
              return row.id;
            })
          );
        }
      }
      setIsExpandedAll(!isExpandedAll);
    }, [
      setRowExpand,
      isExpandedAll,
      searchApiData,
      getExpandAll,
      setSearchApiData,
      setIsExpandedAll,
    ]);
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
          selector: (row) => row[columnName],
          style: { display: "none" },
          width: width,
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
          width: "5.5%",
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
              style: { width: "14%!important" },
            },
          ],
        },
        createColumnChildToFilter("InventoriesName", "18%", "SLOT"),
        createColumnChildToFilter("PID", "14%", "PID"),
        createColumnChildToFilter("Serial", "14%", "Serial"),
        createColumnChildToFilter("CDESC", "34%", "DESCRIPTION"),
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
          expandableRowExpanded={(row) =>
            rowExpand.some((item) => item === row.id)
          }
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
