import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import React, { useState } from "react";
import InventoriesComponentOnline from "./InventoriesComponentOnline";
import { api } from "../../Interceptor";
import Swale from "sweetalert2";
const API_URL = api.defaults.baseURL;
const InventoriesOnline = () => {
  const [inputs, setInputs] = useState({});
  const [apiData, setApiData] = useState(null);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inputs2 = ["  10.0.137.133  ", " 10.0.137.13444  "];

      // const inputs2 = inputs.ip;
      const formData = new FormData();

      formData.append("ip", JSON.stringify(inputs2));
      const { data } = await api.post(API_URL + "createOnline", formData);
      console.log(data);
      //các thiết bị error
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
      //nếu cha insert thành công
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
      console.log("Err");
      const message = err?.response?.data?.error ?? err?.error ?? err;
      console.log(message);
    }
  };
  const handleShow = async (e) => {
    e.preventDefault();

    try {
      const inputs = ["10.0.137.133", "10.0.137.134"];
      /*const { data } = await api.post(API_URL + "createOnline", inputs);
      console.log(data);
      //nếu cha insert thành công
      if (data[0].Name !== "") {
        setSearchApiData(data);
      }
      //nếu như searchapidata đang có dữ liệu
      else if (searchApiData.length > 0) setSearchApiData([]);*/
    } catch (error) {
      console.log("Err");
      console.log(error);
    }
  };

  return (
    <div>
      <MDBBtn onClick={handleShow} size="lg">
        handleShow
      </MDBBtn>
      <form onSubmit={handleSubmit} id="formLogin">
        <div className="mb-3">
          <label htmlFor="ip">
            Ip <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control"
            onChange={handleChange}
            name="ip"
            id=""
            placeholder="Ip"
          />
        </div>
      </form>

      <MDBBtn type="submit" form="formLogin" size="lg">
        Create
      </MDBBtn>

      <MDBContainer fluid>
        <MDBCard
          className="bg-white my-5 mx-auto"
          style={{ position: "static" }}
        >
          <MDBCardBody className="p-5 w-100 d-flex flex-column">
            {apiData && <InventoriesComponentOnline apiData={apiData} />}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};
export default InventoriesOnline;
