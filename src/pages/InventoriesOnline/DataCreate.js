import React, { memo } from "react";

import { api } from "../../Interceptor";
import Swale from "sweetalert2";
import { MDBBtn } from "mdb-react-ui-kit";

const API_URL = api.defaults.baseURL;
const DataCreate = memo(({ device_list = {} }) => {
  const getCreate = async () => {
    try {
      const formData = new FormData();
      device_list = {
        device_type: "cisco_xr",
        ip: "10.0.137.200",
        deviceName: "asd",
        port: 22,
        username: "epnm",
        password: "epnm@890!",
      };
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
      console.log(dataSuccess);
    } catch (err) {
      const message = err?.response?.data?.error ?? err?.error ?? err;
      console.error(message);
    }
  };
  return (
    <MDBBtn type="submit" form="formLogin" size="lg" onClick={getCreate}>
      Create
    </MDBBtn>
  );
});

export default DataCreate;
