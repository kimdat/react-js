import React, { useCallback, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form } from "react-bootstrap";

import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FilterColumn } from "./../../components/FilterColumn/FilterColumn";
import FilterComponent from "./../../components/FilterComponent/FilterComponent";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";
import "../../pages/Datatable.css";
import ExpandableRowLazyComponent from "../../components/ExpandRowLazyComponent/ExpandRowLazyComponent";
import {
  FILED_COLUMN_INVENTORIES,
  FILED_COLUMN__FILTER_INVENTORIES,
  TITLE_COLUMN_INVENTORIES,
  TITLE_COLUMN__FILTER_INVENTORIES,
  WIDTH_COLUMN_INVENTORIES,
} from "./ConstraintInventoriesComponent";
import Pagination from "../common/Pagination";
import styles from "./../../features/devices/components/DeviceListTable/DeviceListTable.module.scss";
const resize = (column, width) => {
  column.style.width = `${width}px`;
};
const fncResizeColumn = () => {
  const classTable = document.querySelector(".table-wrapper");

  const resizableColumns = classTable.querySelectorAll(".rdt_TableCol");

  const width = parseInt(window.getComputedStyle(classTable).width);
  const widthLastCol =
    (width * parseInt(WIDTH_COLUMN_INVENTORIES.CDESC, 10)) / 100;
  //resize col cuối
  resize(resizableColumns[resizableColumns.length - 1], widthLastCol);
  //Bỏ đi width col cuối cùng
  let widthOtherCol = width - widthLastCol;
  const data = WIDTH_COLUMN_INVENTORIES;
  const emptyKeys = Object.keys(data).reduce(function (acc, key, index) {
    if (data[key] === "") {
      acc.push(index);
    } else {
      widthOtherCol -= parseInt(data[key]);
    }
    return acc;
  }, []);

  const widthResize = widthOtherCol / emptyKeys.length;
  emptyKeys.forEach(function (index) {
    resize(resizableColumns[index], widthResize);
  });
};
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
    setCurrentPage = () => {},
  }) => {
    useEffect(() => {
      fncResizeColumn();
    }, []);
    useEffect(() => {
      const container = document.getElementsByClassName("rdt_TableBody");

      console.log(container[0].clientHeight);
      console.log(container[0].scrollHeight);
    }, [searchApiData]);
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
          setSearchApiData(newSearchApiData);
        }
        console.log(row);
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
          style: {
            display: "none",
          },
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
          width: WIDTH_COLUMN_INVENTORIES.Selected,
        },

        {
          name: (
            <FilterColumn
              column={FILED_COLUMN_INVENTORIES.No}
              nameTitle={TITLE_COLUMN_INVENTORIES.No}
              handleFilterColumn={handleFilterColumn}
            ></FilterColumn>
          ),
          selector: (row) => row.No,
          width: WIDTH_COLUMN_INVENTORIES.No,
        },
        {
          name: (
            <FilterColumn
              column={FILED_COLUMN_INVENTORIES.Name}
              nameTitle={TITLE_COLUMN_INVENTORIES.Name}
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
                    <span
                      style={{
                        color: "black",
                        paddingLeft: "5px",
                        userSelect: "text",
                      }}
                    >
                      {row.Name}
                    </span>
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
        createColumnChildToFilter(
          FILED_COLUMN__FILTER_INVENTORIES.Name,
          "",
          TITLE_COLUMN__FILTER_INVENTORIES.Name
        ),
        createColumnChildToFilter(
          FILED_COLUMN__FILTER_INVENTORIES.Pid,
          "",
          TITLE_COLUMN__FILTER_INVENTORIES.Pid
        ),
        createColumnChildToFilter(
          FILED_COLUMN__FILTER_INVENTORIES.Serial,
          "",
          TITLE_COLUMN__FILTER_INVENTORIES.Serial
        ),
        createColumnChildToFilter(
          FILED_COLUMN__FILTER_INVENTORIES.CDESC,
          WIDTH_COLUMN_INVENTORIES.CDESC,
          TITLE_COLUMN__FILTER_INVENTORIES.CDESC
        ),
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
    const PageSizeSelector = useCallback((props) => {
      const { onsizeChange, pageSizes } = props;
      return (
        <Form.Group className={styles.pageSizeSelectorWrapper}>
          <label htmlFor="page-selector">Rows per page:</label>
          <Form.Select
            id="page-selector"
            size="sm"
            onChange={(e) => onsizeChange(e.target.value)}
          >
            {pageSizes.map((size, idx) => (
              <option key={idx} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      );
    }, []);
    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <Button
            className="btnExpandAll"
            size="sm"
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
        <div className="table-wrapper">
          <DataTable
            style={{ width: "100%", tableLayout: "auto" }}
            highlightOnHover
            paginationDefaultPage={currentPage}
            paginationTotalRows={totalRow}
            paginationPerPage={rowsPerPage}
            columns={columns}
            data={searchApiData}
            expandableRows
            onChangePage={handlePageChange}
            expandableRowsHideExpander
            expandableRowExpanded={(row) =>
              rowExpand.some((item) => item === row.id)
            }
            responsive={true}
            dense={true}
            expandableRowsComponent={expandableRowsComponent}
            className="my-custom-data-table inventories"
            striped
          />
        </div>
        <div className={styles.paginationWrapper} style={{ margin: "0px  " }}>
          <PageSizeSelector
            onsizeChange={handleRowsPerPageChange}
            pageSizes={[10, 15, 20, 25, 30]}
          />
          <Pagination
            className={styles.pagination}
            onPageChange={setCurrentPage}
            totalCount={totalRow}
            siblingCount={0}
            currentPage={currentPage}
            pageSize={rowsPerPage}
          />
        </div>
      </div>
    );
  }
);
export default InventoriesComponent;
