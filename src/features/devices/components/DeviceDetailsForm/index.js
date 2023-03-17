import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { deviceType } from "../../data/constants";
import styles from "./DeviceDetailsForm.module.scss";
import classNames from "classnames";

const cx = classNames.bind(styles);

const DeviceDetailsForm = (props) => {
  const { device, inputChangeHandlers, regions, provinces, errors, texts } =
    props;
  const formConfigs = [
    {
      type: "text",
      validationRegex: "",
      label: "Device Name",
      id: "device_name_input",
      name: "DeviceName",
      value: device.deviceName,
      onChange: (e) => inputChangeHandlers.setDeviceName(e.target.value),
    },
    {
      type: "text",
      validationRegex: "",
      label: "IP",
      id: "ip_loopback_input",
      name: "Ip",
      value: device.ipLoopback,
      onChange: (e) => inputChangeHandlers.setIpLoopback(e.target.value),
    },
    {
      type: "select",
      label: "Device type",
      options: deviceType,
      id: "device_type_select",
      name: "Device_Type",
      value: device.deviceType,
      onChange: (e) => inputChangeHandlers.setDeviceType(e.target.value),
    },
    {
      type: "select",
      label: "Region",
      options: regions,
      id: "region_select",
      name: "region_id",
      value: device.region,
      onChange: (e) => inputChangeHandlers.setRegion(e.target.value),
    },
    {
      type: "select",
      label: "Province",
      options: provinces,
      id: "province_select",
      name: "province_id",
      value: device.province,
      onChange: (e) => inputChangeHandlers.setProvince(e.target.value),
    },
    {
      type: "text",
      mask: "",
      validationRegex: "",
      label: "Longitude",
      id: "longitude_input",
      name: "long",
      value: device.long,
      onChange: (e) => inputChangeHandlers.setLong(e.target.value),
    },
    {
      type: "text",
      mask: "",
      validationRegex: "",
      label: "Latitude",
      id: "latitude_input",
      name: "lat",
      value: device.lat,
      onChange: (e) => inputChangeHandlers.setLat(e.target.value),
    },
    {
      type: "text",
      label: "Address",
      id: "address_input",
      name: "address",
      value: device.address,
      onChange: (e) => inputChangeHandlers.setAddress(e.target.value),
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
              value={config.value}
              onChange={config.onChange}
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
                value={config.value}
                onChange={config.onChange}
              >
                {(inputProps) => createInput(inputProps)}
              </ReactInputMask>
            );
          } else {
            element = createInput({
              value: config.value,
              onChange: config.onChange,
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
