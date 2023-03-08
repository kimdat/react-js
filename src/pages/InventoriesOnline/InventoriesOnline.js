import { MDBBtn, MDBCheckbox, MDBIcon } from "mdb-react-ui-kit";
import React, { useState } from "react";
import InventoriesComponentOnline from "./InventoriesComponentOnline";
import { api } from "../../Interceptor";
const API_URL = api.defaults.baseURL;
const InventoriesOnline = () => {
  const [inputs, setInputs] = useState({});
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    ///formData.append("ip", inputs.ip);
    //formData.append("deviceName", inputs.deviceName);

    try {
      const { data } = await api.post(API_URL + "createOnline", inputs);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} id="formLogin">
        <div className="mb-3">
          <label htmlFor="deviceName">
            DeviceName <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control"
            onChange={handleChange}
            name="deviceName"
            id=""
            placeholder="DeviceName"
          />
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
      <InventoriesComponentOnline />
    </div>
  );
};
export default InventoriesOnline;
