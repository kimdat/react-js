import Swale from "sweetalert2";
import React, {
  forwardRef,
  useEffect,
  memo,
  useState,
  useMemo,
  useCallback,
  createContext,
  useImperativeHandle,
} from "react";
import { api } from "../../../../Interceptor";
import LoadingComponent from "../../../../components/LoadingComponent/LoadingComponent";
import { FilterColumn } from "../../../../components/FilterColumn/FilterColumn";
import DataTable from "react-data-table-component";
import {
  FILED_DEVICE_ONLINE,
  TITLE_DEVICE_ONLINE,
  WIDTH_COLUMN_DEVICE_ONLINE,
} from "../../ConstraintDivceOnline";
export const DevicesOnlineChildContext = createContext(null);
const API_URL = api.defaults.baseURL;
const DevicesOnline = memo(
  forwardRef((props, ref) => {
    const [apiData, setApiData] = useState(null);
    const [dataToSearch, setDataToSearch] = useState(null);
    const [checkedRows, setCheckedRows] = useState([]);
    useImperativeHandle(ref, () => ({
      // Định nghĩa hàm handleClick() để có thể gọi từ cha
      checkedRows,
    }));
    useEffect(() => {
      const loadData = async () => {
        try {
          const { data } = await api.get(API_URL + "devicesOnline");
          console.log(data);
          setDataToSearch(data.devices);
          setApiData(data.devices);
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
    }, []);

    return (
      apiData && (
        <DevicesOnlineChild
          data={apiData}
          dataToSearch={dataToSearch}
          setData={setApiData}
          checkedRows={checkedRows}
          setCheckedRows={setCheckedRows}
        />
      )
    );
  })
);

const DevicesOnlineChild = memo(
  ({ dataToSearch, data, setData, checkedRows, setCheckedRows }) => {
    const [checkAll, setCheckAll] = useState(false);
    const [inputs, setInputs] = useState({});
    //search column
    const handleFilterColumn = useCallback(
      async (e) => {
        if (e.key !== "Enter") {
          return;
        }
        const name = e.target.name;
        const value = e.target.value.trim();
        const newInputs = { ...inputs, [name]: value };
        //nếu giá trị cũ thì return luôn
        if (
          JSON.stringify(inputs).toLowerCase() ===
          JSON.stringify(newInputs).toLowerCase()
        )
          return;
        console.log(newInputs);
        const newData = dataToSearch.filter((item) => {
          for (let key in newInputs) {
            if (
              item.hasOwnProperty(key) &&
              item[key]
                .toLowerCase()
                .trim()
                .includes(newInputs[key].toLowerCase().trim())
            ) {
              console.log(item[key]);
              console.log(newInputs[key]);
              continue;
            } else {
              return false;
            }
          }
          return true;
        });

        //nếu search không thấy
        if (newData.length === 0) {
          setData([{ statusNotFound: true }]);
        } else {
          setData(newData);
        }

        setInputs(newInputs);
      },

      [inputs, dataToSearch, setData]
    );

    const handleCheckAll = useCallback(async () => {
      setCheckAll(!checkAll);
      if (!checkAll) {
        setCheckedRows(data);
      } else {
        setCheckedRows([]);
      }
    }, [checkAll, data, setCheckedRows]);
    const handleCheck = useCallback(
      (row) => {
        if (checkedRows.some((item) => item.id === row.id)) {
          setCheckedRows(checkedRows.filter((rowId) => rowId.id !== row.id));
        } else {
          setCheckedRows([...checkedRows, row]);
        }
      },
      [checkedRows, setCheckedRows]
    );
    const createColumnToFilter = useCallback(
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

          width: width,
          resizable: true, // cho phép resize cột
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
          width: WIDTH_COLUMN_DEVICE_ONLINE.Selected,
        },

        createColumnToFilter(
          FILED_DEVICE_ONLINE.No,
          WIDTH_COLUMN_DEVICE_ONLINE.No,
          TITLE_DEVICE_ONLINE.No
        ),
        {
          name: (
            <FilterColumn
              column={FILED_DEVICE_ONLINE.Name}
              nameTitle={TITLE_DEVICE_ONLINE.Name}
              handleFilterColumn={handleFilterColumn}
            ></FilterColumn>
          ),
          cell: (row) => {
            if (row.hasOwnProperty("statusNotFound")) {
              return <div>There are no record</div>;
            }
            return <div>{row[FILED_DEVICE_ONLINE.Name].toUpperCase()}</div>;
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
              width: WIDTH_COLUMN_DEVICE_ONLINE.Name,
            },
          ],
          resizable: true, // cho phép resize cột
        },
        createColumnToFilter(
          FILED_DEVICE_ONLINE.Ip,
          WIDTH_COLUMN_DEVICE_ONLINE.Ip,
          TITLE_DEVICE_ONLINE.Ip
        ),
      ],
      [
        createColumnToFilter,
        handleCheck,
        handleCheckAll,
        checkAll,
        checkedRows,
        handleFilterColumn,
      ]
    );
    return (
      <LoadingComponent>
        <div>
          <DataTable
            dense={true}
            data={data}
            fixedHeader={true}
            columns={columns}
            fixedHeaderScrollHeight="400px"
            responsive={true}
            highlightOnHover
            striped
            className="my-custom-data-table "
            resizable={true}
          />
        </div>
      </LoadingComponent>
    );
  }
);

export default DevicesOnline;
