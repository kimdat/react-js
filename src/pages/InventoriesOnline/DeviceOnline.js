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
import { api } from "../../Interceptor";
import LoadingComponent from "./../../components/LoadingComponent/LoadingComponent";

import { FilterColumn } from "./../../components/FilterColumn/FilterColumn";
import DataTable from "react-data-table-component";

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
          //data trước khi filter
          setDataToSearch(data.devices);
          setApiData(data.devices);
        } catch (err) {
          console.log(err.response);
          Swale.fire({
            icon: "error",
            text: `Error when fetchData() ${err}`,
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
        console.log(dataToSearch);

        const newData = dataToSearch.filter((item) => {
          for (let key in newInputs) {
            if (
              item.hasOwnProperty(key) &&
              item[key]
                .toLowerCase()
                .trim()
                .includes(newInputs[key].toLowerCase().trim())
            ) {
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
          selector: (row) => row["STT"],
          width: "50px",
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
            return <div>{row.Name.toUpperCase()}</div>;
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
              width: "30%",
            },
          ],
        },
        createColumnToFilter("Ip", "40%", "IP Loopback"),
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
        <DataTable
          dense={true}
          data={data}
          fixedHeader={true}
          columns={columns}
          fixedHeaderScrollHeight="400px"
          responsive={true}
          highlightOnHover
          striped
          className="my-custom-data-table"
        />
      </LoadingComponent>
    );
  }
);

export default DevicesOnline;
