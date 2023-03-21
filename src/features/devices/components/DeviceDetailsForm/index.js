import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { deviceType } from "../../data/constants";
import styles from "./DeviceDetailsForm.module.scss";
import classNames from "classnames";
import { fieldNames } from "../../data/constants";

const cx = classNames.bind(styles);

const DeviceDetailsForm = (props) => {
  const { inputs, setInputs, regions, provinces, errors, texts } =
    props;
  const formConfigs = [
    {
      type: "text",
      validationRegex: "",
      label: "Device Name",
      id: "device_name_input",
      name: fieldNames.DEVICE_NAME,
    },
    {
      type: "text",
      validationRegex: "",
      label: "IP",
      id: "ip_loopback_input",
      name: fieldNames.IP,
    },
    {
      type: "select",
      label: "Device type",
      options: deviceType,
      id: "device_type_select",
      name: fieldNames.DEVICE_TYPE,
    },
    {
      type: "select",
      label: "Region",
      options: regions,
      id: "region_select",
      name: fieldNames.REGION_ID,
    },
    {
      type: "select",
      label: "Province",
      options: provinces,
      id: "province_select",
      name: fieldNames.PROVINCE_ID,
    },
    {
      type: "text",
      mask: "",
      validationRegex: "",
      label: "Longitude",
      id: "longitude_input",
      name: fieldNames.LONG,
    },
    {
      type: "text",
      mask: "",
      validationRegex: "",
      label: "Latitude",
      id: "latitude_input",
      name: fieldNames.LAT,
    },
    {
      type: "text",
      label: "Address",
      id: "address_input",
      name: fieldNames.ADDRESS,
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
              className={styles.formControl}
              size="sm"
              name={config.name}
              id={config.id}
              key={idx}
              value={inputs(config.name)}
              onChange={(e) => setInputs(config.name, e.target.value)}
              isInvalid={errors(config.name)}
            >
              <option>--</option>
              {config.options?.map((option, idx) => (
                <option value={option.id} key={idx}>
                  {option.name}
                </option>
              ))}
            </Form.Select>
          );
        } else {
          const createInput = (props) => (
            <Form.Control
              className={styles.formControl}
              {...props}
              type={config.type}
              id={config.id}
              name={config.name}
              size="sm"
              isInvalid={errors(config.name)}
            />
          );
          if (config.mask) {
            element = (
              <ReactInputMask
                mask={config.mask}
                value={inputs(config.name)}
                onChange={(e) => setInputs(config.name, e.target.value)}
              >
                {(inputProps) => createInput(inputProps)}
              </ReactInputMask>
            );
          } else {
            element = createInput({
              value: config.value,
              onChange: (e) => setInputs(config.name, e.target.value),
            });
          }
        }
        return (
          <Form.Group className={styles.formGroup} key={config.id}>
            <Form.Label className={styles.formLabel} htmlFor={config.id}>
              {config.label}
            </Form.Label>
            {element}
            {texts(config.name) && (
              <Form.Text className={cx(styles.formText, "text-danger")}>
                {texts(config.name)}
              </Form.Text>
            )}
          </Form.Group>
        );
      })}
    </Form>
  );
};

export default DeviceDetailsForm;
