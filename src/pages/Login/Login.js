import React, { useState } from "react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { api } from "../../Interceptor.js";
const API_URL = api.defaults.baseURL;

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(inputs);
    setErrors(err);
    if (Object.keys(err).length === 0) {
      try {
        const { data } = await api.post(API_URL + "login", inputs);
        if (data.status === 0) {
          Swal.fire({
            icon: "error",
            text: data.mess,
          });
        } else {
          localStorage.setItem("email", inputs.email);

          navigate("/inventories");
        }
      } catch (err) {
        console.error(err);
        let messErr = err;
        if (messErr.response.data) messErr = messErr.response.data;
        if (messErr.Error) messErr = messErr.Error;
        Swal.fire({
          icon: "error",
          text: "Error login " + messErr,
        });
      }
    }
  };
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }

    return errors;
  };
  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "500px" }}
          >
            <MDBCardBody className="p-5 w-100 d-flex flex-column">
              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">
                Please enter your login and password!
              </p>
              <form onSubmit={handleSubmit} id="formLogin">
                <div className="mb-3">
                  <label htmlFor="email">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    className="form-control"
                    onChange={handleChange}
                    type="email"
                    name="email"
                    id=""
                    placeholder="Email"
                  />
                  <span className="error">{errors.email}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="pass">
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    className="form-control"
                    onChange={handleChange}
                    type="password"
                    name="password"
                    id=""
                    placeholder="Password"
                  />
                  <span className="error">{errors.password}</span>
                </div>
              </form>
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                className="mb-4"
                label="Remember password"
              />

              <MDBBtn type="submit" form="formLogin" size="lg">
                Login
              </MDBBtn>

              <hr className="my-4" />

              <MDBBtn
                className="mb-2 w-100"
                size="lg"
                style={{ backgroundColor: "#dd4b39" }}
              >
                <MDBIcon fab icon="google" className="mx-2" />
                Sign in with google
              </MDBBtn>

              <MDBBtn
                className="mb-4 w-100"
                size="lg"
                style={{ backgroundColor: "#3b5998" }}
              >
                <MDBIcon fab icon="facebook-f" className="mx-2" />
                Sign in with facebook
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
export default Login;
