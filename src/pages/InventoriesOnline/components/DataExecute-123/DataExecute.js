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
import { useDispatch, useSelector } from "react-redux";
import {
  setDataFilterNotPag,
  setIsLoading,
  setRowExpand,
  setSearchApiData,
  setTotalRow,
  sliceIsLoading,
  sliceSearchApiData,
} from "../../../DEVICEINVENTORY/inventoryChildSlice";
const DataExecute = memo(
  forwardRef((props, ref) => {
    const disPatch = useDispatch();
    const isLoading = useSelector(sliceIsLoading);
    const searchApiData = useSelector(sliceSearchApiData);

    const getExecute = async (device_list) => {
      try {
        disPatch(setIsLoading(true));

        /*for (var i = 0; i < 100; i++) {
          dataSuccess.push({
            STT: i,
            ip: "123",
            id: "123123" + i,
            Name: "123123",
            children: [],
          });
        }*/
        const formData = new FormData();
        formData.append("ip", JSON.stringify(device_list));
        const { data } = await axios.post(
          "http://localhost/NETMIKO/home.py",
          formData
        );
        console.log(data);
        const inventory = JSON.parse(data.deviceData);
        const dataSuccess = [];
        const dataFail = [];
        let stt = 1;
        device_list.forEach((device) => {
          const ip = device.Ip;
          const dataInventory = inventory[ip];
          var children = [];
          //nếu connect success
          if (!dataInventory[0].Err) {
            children = dataInventory;
            dataSuccess.push({
              STT: stt++,
              ip: ip,
              id: device.id,
              Name: device.DeviceName,
              children: children,
            });
          } else {
            dataFail.push({
              ip: ip,
              id: device.id,
              Name: device.DeviceName,
              children: children,
            });
          }
        });
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
          disPatch(setSearchApiData(dataSuccess.slice(0, 10)));
          disPatch(setRowExpand(dataSuccess.map((item) => item.id)));
          disPatch(setTotalRow(dataSuccess.length));
          disPatch(setDataFilterNotPag(dataSuccess));
        } else disPatch(setSearchApiData([]));
        disPatch(setIsLoading(false));
      } catch (err) {
        disPatch(setSearchApiData([]));
        disPatch(setIsLoading(false));
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
              <InventoriesComponentOnline />
            </div>
          )}
        </LoadingComponent>
      </>
    );
  })
);
export default DataExecute;
