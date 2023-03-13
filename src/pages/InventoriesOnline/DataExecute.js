import React, { useState, forwardRef, useCallback } from "react";
import InventoriesComponentOnline from "./InventoriesComponentOnline";
import { api } from "../../Interceptor";
import Swale from "sweetalert2";
const API_URL = api.defaults.baseURL;
const DataExecute = forwardRef((props, ref) => {
  const [rowExpand, setRowExpand] = useState([]);
  //datapage hiện tại
  const [searchApiData, setSearchApiData] = useState([]);
  //tổng row
  const [totalRow, setTotalRow] = useState(0);
  //tổng data
  const [dataAll, setDataAll] = useState([]);
  const getExecute = async () => {
    try {
      const device_list = [];
      const device1 = {
        device_type: "cisco_xr",
        ip: "10.0.137.200",
        username: "epnm",
        password: "epnm@890!",
        port: 22,
        deviceName: "abc",
      };
      const device2 = {
        device_type: "cisco_xr",
        ip: "10.0.137.141",
        username: "epnm",
        password: "epnm@890!",
        port: 22,
        deviceName: "desse",
      };
      device_list.push(device1);
      device_list.push(device2);

      const formData = new FormData();
      formData.append("device_list", JSON.stringify(device_list));
      const { data } = await api.post(API_URL + "createOnline", formData);
      console.log(data);
      //các thiết bị thành công
      const dataSuccess = data.success;
      const dataFail = data.fail;
      if (dataFail.length > 0) {
        const messFail = dataFail.map((i) => i.ip);
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
      } else setSearchApiData([]);
    } catch (err) {
      setSearchApiData([]);
      const message = err?.response?.data?.error ?? err?.error ?? err;
      console.error(message);
    }
  };
  const handleClick = useCallback(async () => {
    getExecute();
  }, []);
  React.useImperativeHandle(ref, () => ({
    // Định nghĩa hàm handleClick() để có thể gọi từ cha
    handleClick,
  }));

  return (
    <>
      <button style={{ display: "none" }} onClick={handleClick}>
        Click me!
      </button>
      {searchApiData.length > 0 && (
        <InventoriesComponentOnline
          searchApiData={searchApiData}
          setSearchApiData={setSearchApiData}
          totalRow={totalRow}
          rowExpand={rowExpand}
          setRowExpand={setRowExpand}
          dataAll={dataAll}
        />
      )}
    </>
  );
});
export default DataExecute;
