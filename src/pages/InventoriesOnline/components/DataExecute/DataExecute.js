import React, {
  useState,
  forwardRef,
  useCallback,
  memo,
  useImperativeHandle,
} from "react";
import InventoriesComponentOnline from "../InventoriesComponent/InventoriesComponentOnline";

import Swale from "sweetalert2";
import LoadingComponent from "../../../../components/LoadingComponent/LoadingComponent";
import axios from "axios";
import { FILED_DEVICE_ONLINE } from "./../../ConstraintDivceOnline";
const handleData = (deviceList, data) => {
  const dataSuccess = [];
  const dataFail = [];
  const dataChildren = [];
  let stt = 1;

  deviceList.forEach((device) => {
    const ip = device.Ip;
    const dataInventory = data[ip];
    const objInventories = {
      [FILED_DEVICE_ONLINE.id]: device.id,
      [FILED_DEVICE_ONLINE.Name]: device.DeviceName,
    };

    if (!dataInventory.Err) {
      objInventories[FILED_DEVICE_ONLINE.No] = stt++;
      const newInventory = dataInventory.map((item) => ({
        ...item,
        parentId: device.id,
      }));
      objInventories["children"] = newInventory;
      dataChildren.push(...newInventory);
      dataSuccess.push(objInventories);
    } else {
      dataFail.push(objInventories);
    }
  });

  return { dataSuccess, dataFail, dataChildren };
};

const DataExecute = memo(
  forwardRef((props, ref) => {
    const [rowExpand, setRowExpand] = useState([]);
    //datapage hiện tại
    const [searchApiData, setSearchApiData] = useState([]);
    //tổng row
    const [totalRow, setTotalRow] = useState(0);
    //tổng data
    const [dataAll, setDataAll] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const getExecute = async (device_list) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("ip", JSON.stringify(device_list));
        const { data } = await axios.post(
          "http://localhost/NETMIKO/home.py",
          formData
        );

        setIsLoading(false);

        const { dataSuccess, dataFail, dataChildren } = handleData(
          device_list,
          data
        );

        if (dataFail.length > 0) {
          const messFail = dataFail.map((i) => i[FILED_DEVICE_ONLINE.Ip]);
          Swale.fire({
            title: "ConnectFail",
            icon: "error",
            html: `Have ${
              messFail.length
            } ConnectFail.Ip connect fail:${messFail.join(",")}`,
          });
        }
        if (dataSuccess.length > 0) {
          setSearchApiData(dataSuccess.slice(0, 10));

          setRowExpand(dataSuccess.map((item) => item.id));
          setTotalRow(dataSuccess.length);
          setDataAll(dataSuccess);
          setChildren(dataChildren);
        } else setSearchApiData([]);
      } catch (err) {
        setSearchApiData([]);
        setIsLoading(false);
        const message = err?.response?.data?.error ?? err?.error ?? err;
        console.error(message);
      }
    };
    const handleClick = useCallback(async (rowCheck) => {
      getExecute(rowCheck);
    }, []);
    useImperativeHandle(ref, () => ({
      // Định nghĩa hàm handleClick() để có thể gọi từ cha
      handleClick,
    }));

    return (
      <>
        <button style={{ display: "none" }} onClick={handleClick}>
          Click me!
        </button>
        <LoadingComponent isLoading={isLoading}>
          {searchApiData.length > 0 && (
            <div>
              <InventoriesComponentOnline
                searchApiData={searchApiData}
                setSearchApiData={setSearchApiData}
                totalRow={totalRow}
                rowExpand={rowExpand}
                setRowExpand={setRowExpand}
                dataAll={dataAll}
                children={children}
              />
            </div>
          )}
        </LoadingComponent>
      </>
    );
  })
);
export default DataExecute;
