import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import React, { useState, forwardRef, createRef, useCallback } from "react";
import InventoriesComponentOnline from "./InventoriesComponentOnline";
import { api } from "../../Interceptor";
import Swale from "sweetalert2";
const API_URL = api.defaults.baseURL;
const DataCreate = forwardRef((props, ref) => {
  console.log("datafeching");
  const [apiData, setApiData] = useState(null);
  const handleClick = useCallback(async () => {
    try {
      const pust = [];
      for (let index = 0; index < 12; index++) {
        const data = {
          ip: "1" + Math.random(0, 100),
          id: "123" + Math.random(0, 100),
          Name: Math.random(0, 100),
          children: [],
        };
        pust.push(data);
      }
      pust.total_row = 100;
      pust.row_expand = [];
      pust.dataShow = pust.slice(0, 10);
      pust.data = pust;
      console.log(pust);
      setApiData(pust);
    } catch (error) {
      console.log("Err");
      console.log(error);
    }
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
      {apiData && <InventoriesComponentOnline apiData={apiData} />}
    </>
  );
});
const DataExecute = forwardRef((props, ref) => {
  console.log("datafeching");
  const [apiData, setApiData] = useState(null);
  const getExecute = async () => {
    try {
      const inputs2 = [
        "  10.0.137.133  ",
        " 10.0.137.13444  ",
        "10.0.137.133t ",
        "10.0.137.1334 ",
        "10.0.137.1335 ",
        "10.0.137.1336 ",
        "10.0.137.1337 ",
        "10.0.137.13389 ",
        "10.0.137.1338 ",
        "10.0.137.1339 ",
      ];
      const formData = new FormData();
      formData.append("ip", JSON.stringify(inputs2));
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
        const apiData = {};
        //data show trên giao diện
        apiData.dataShow = dataSuccess.slice(0, 10);
        apiData.total_row = dataSuccess.length;
        //Row expand
        apiData.row_expand = dataSuccess.map((item) => item.id);
        //Tổng data
        apiData.data = dataSuccess;
        setApiData(apiData);
      } else setApiData(null);
    } catch (err) {
      setApiData(null);
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
      {apiData && <InventoriesComponentOnline apiData={apiData} />}
    </>
  );
});

const InventoriesOnline = () => {
  console.log("invonline");
  const childRef = createRef();
  const handleButtonClick = () => {
    // Gọi hàm handleClick() trong component con
    childRef.current.handleClick();
  };

  return (
    <div>
      <MDBBtn
        type="submit"
        form="formLogin"
        size="lg"
        onClick={handleButtonClick}
      >
        Create
      </MDBBtn>

      <MDBContainer fluid>
        <MDBCard
          className="bg-white my-5 mx-auto"
          style={{ position: "static" }}
        >
          <MDBCardBody className="p-5 w-100 d-flex flex-column">
            <DataExecute ref={childRef}></DataExecute>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};
export default InventoriesOnline;
