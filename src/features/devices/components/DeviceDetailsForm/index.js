import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { api } from "../../../../Interceptor";
import { deviceType, province, region } from "../../data/constants";
import styles from "./DeviceDetailsForm.module.scss";
import Swale from "sweetalert2";
const API_URL = api.defaults.baseURL;
const DeviceDetailsForm = (props) => {
  const setInputs = props.setInputs;
  const inputs = props.inputs;

  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      const newInputs = {
        ...inputs,
        deviceType: deviceType[0].value,
        region: region[0].value,
        province: province[0].value,
        ip: "",
        long: "",
        lat: "",
        address: "",
        username: "epnm",
        password: "epnm@890!",
      };
      console.log(newInputs);
      setInputs(newInputs);
    }
  }, [inputs, setInputs]);

  const handleSetInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value.trim();

    const newInputs = { ...inputs, [name]: value };
    console.log(newInputs);
    setInputs(newInputs);
  };
  const handleOnBlur = (e) => {
    //check laid
  };
  const handleCheckDuplicate = async (e) => {
    try {
      const formData = new FormData();
      const name = e.target.name;
      const value = e.target.value.trim();
      formData.append("name", name);
      formData.append("value", value);
      const { data } = await api.post(`${API_URL}checkDuplicate`, formData);
      console.log(data);
      //nếu trùng thì return true
      return typeof data.duplicate != "undefined";
    } catch (err) {
      const message =
        err.response?.data?.error ?? err?.error ?? err.response.data;
      console.error(err.response.data);
      Swale.fire({
        icon: "error",
        text: `Error handleDuplicate ${message}`,
      });
      return false;
    }
  };

  const formConfigs = [
    {
      type: "text",
      validationRegex: "",
      label: "Device Name",
      id: "device_name_input",
      name: "deviceName",

      onChange: (e) => {
        handleSetInputs(e);
      },
      onBlur: async (e) => {
        //check valid
        handleOnBlur();
        //kiểm tra trùng
        if (await handleCheckDuplicate(e)) {
          console.log("dup");
        }
      },
    },
    {
      type: "text",
      mask: "99.9.999.999",
      validationRegex: "",
      label: "IP Loopback",
      id: "ip_loopback_input",
      name: "ip",
      onChange: (e) => {
        handleSetInputs(e);
      },
      onBlur: async (e) => {
        handleOnBlur();
        if (await handleCheckDuplicate(e)) {
          console.log("dup");
        }
      },
    },
    {
      type: "select",
      label: "Device type",
      options: deviceType,
      id: "device_type_select",
      name: "deviceType",

      onChange: (e) => {
        handleSetInputs(e);
      },
    },
    {
      type: "select",
      label: "Region",
      options: region,
      id: "region_select",
      name: "region",

      onChange: (e) => {
        handleSetInputs(e);
      },
    },
    {
      type: "select",
      label: "Province",
      options: province,
      id: "province_select",
      name: "province",

      onChange: (e) => {
        handleSetInputs(e);
      },
    },
    {
      type: "text",
      mask: "",
      validationRegex: "",
      label: "Longitude",
      id: "longitude_input",
      name: "long",
      onChange: (e) => {
        handleSetInputs(e);
      },
      onBlur: (e) => {
        handleOnBlur();
      },
    },
    {
      type: "text",
      mask: "",
      validationRegex: "",
      label: "Latitude",
      id: "latitude_input",
      name: "lat",
      onChange: (e) => {
        handleSetInputs(e);
      },
      onBlur: (e) => {
        handleOnBlur();
      },
    },
    {
      type: "text",
      label: "Address",
      id: "address_input",
      name: "address",
      onChange: (e) => {
        handleSetInputs(e);
      },
      onBlur: (e) => {
        handleOnBlur();
      },
    },
  ];

  return (
    <Form className={styles.deviceDetailsForm}>
      {/* rendering input elements via configs */}
      {formConfigs.map((config, idx) => {
        let element = null;
        if (config.type === "select") {
          element = (
            <Form.Select
              onChange={config.onChange}
              size="sm"
              name={config.name}
              id={config.id}
              key={idx}
            >
              {config.options.map((option, idx) => (
                <option value={option.value} key={idx}>
                  {option.name}
                </option>
              ))}
            </Form.Select>
          );
        } else {
          const createInput = (props) => (
            <Form.Control
              {...props}
              type={config.type}
              id={config.id}
              name={config.name}
              size="sm"
            />
          );
          if (config.mask) {
            element = (
              <ReactInputMask
                mask={config.mask}
                onChange={config.onChange}
                onBlur={config.onBlur}
              >
                {(inputProps) => createInput(inputProps)}
              </ReactInputMask>
            );
          } else {
            element = createInput({
              onChange: config.onChange,
              onBlur: config.onBlur,
            });
          }
        }
        return (
          <Form.Group className={styles.formGroup} key={config.id}>
            <Form.Label className={styles.formLabel} htmlFor={config.id}>
              {config.label}
            </Form.Label>
            {element}
          </Form.Group>
        );
      })}
    </Form>
  );
};

export default DeviceDetailsForm;
