import React, { memo, useCallback, useState } from "react";

import { api } from "./../../../../Interceptor";
import Swale from "sweetalert2";
import { MDBBtn } from "mdb-react-ui-kit";

const API_URL = api.defaults.baseURL;
const DataCreateUpdate = memo(
  ({ device_list = {}, flagUpdate = false, setIsLoading = () => {} }) => {
    //xác định là edit hay create
    const EditCreate = flagUpdate ? "Edit" : "Add";

    const messInforOneDevice = useCallback(
      (data) => {
        const dataFail = data.fail;
        const dataErr = data.Err;
        const title =
          dataErr.length > 0 ? "Err" : dataFail.length > 0 ? "Fail" : "Success";
        const icon =
          dataErr.length > 0 || dataFail.length ? "error" : "success";
        const html =
          dataErr.length > 0
            ? `Error when ${EditCreate} device`
            : dataFail.length > 0
            ? `connect fail for:${dataFail[0].ip}`
            : `${EditCreate} success`;
        Swale.fire({
          title,
          icon,
          html,
        });
      },
      [EditCreate]
    );

    const getCreate = useCallback(async () => {
      try {
        console.log(device_list);
        return;
        const formData = new FormData();
        const device_list = [
          {
            device_type: "cisco_xr",
            ip: "10.0.137.200",
            deviceName: "aDaKaasdsd234KK",
            port: 22,
            username: "epnm",
            password: "epnm@890!",
          },
        ];
        //nếu trùng và không phải update thì xử lý
        /*if (!flagUpdate) {
        if ((await checkDuplicate(device_list[0])) === true) {
          handleDuplicate();
          return;
        }
      }*/
        setIsLoading(true);
        formData.append("device_list", JSON.stringify(device_list));
        formData.append("flagUpdate", flagUpdate);
        const { data } = await api.post(API_URL + "createOnline", formData);
        console.log(data);
        //mess thông báo cho 1 thiết bị
        if (device_list.length === 1) {
          messInforOneDevice(data);
          setIsLoading(false);
        }
      } catch (err) {
        const message = err?.response?.data?.error ?? err?.error ?? err;
        console.error(message);
        Swale.fire({
          icon: "error",
          text: `Error getCreate fnc ${message}`,
        });
      }
    }, [flagUpdate, messInforOneDevice, setIsLoading, device_list]);
    return (
      <MDBBtn type="submit" form="formLogin" size="lg" onClick={getCreate}>
        {EditCreate}
      </MDBBtn>
    );
  }
);

export default DataCreateUpdate;
