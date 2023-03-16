import React from "react";
import { Form } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { deviceType, province, region } from "../../data/constants";
import styles from './DeviceDetailsForm.module.scss';

const DeviceDetailsForm = (props) => {
    const formConfigs = [
        {
            type: "text",
            validationRegex: "",
            label: "Device Name",
            id: "device_name_input",
            name: "deviceName",
            onChange: () => {}
        },
        {
            type: "text",
            mask: "999.999.999.999",
            validationRegex: "",
            label: "IP Loopback",
            id: "ip_loopback_input",
            name: "ipLoopback",
            onChange: () => {}
        },
        {
            type: "select",
            label: "Device type",
            options: deviceType,
            id: "device_type_select",
            name: "deviceType",
            onChange: () => {}
        },
        {
            type: "select",
            label: "Region",
            options: region,
            id: "region_select",
            name: "region",
            onChange: () => {}
        },
        {
            type: "select",
            label: "Province",
            options: province,
            id: "province_select",
            name: "province",
            onChange: () => {}
        },
        {
            type: "text",
            mask: "",
            validationRegex: "",
            label: "Longitude",
            id: "longitude_input",
            name: "long",
            onChange: () => {}
        },
        {
            type: "text",
            mask: "",
            validationRegex: "",
            label: "Latitude",
            id: "latitude_input",
            name: "lat",
            onChange: () => {}
        },
        {
            type: "text",
            label: "Address",
            id: "address_input",
            name: "address",
            onChange: () => {}
        }
    ]
    return (
        <Form className={styles.deviceDetailsForm}>
            {/* rendering input elements via configs */}
            {formConfigs.map((config, idx) => {
                let element = null;
                if (config.type === "select") { 
                    element =
                        <Form.Select
                            size="sm"
                            name={config.name}
                            id={config.id}
                            key={idx}
                        >
                            {config.options.map((option, idx) =>
                                <option value={option.value} key={idx}>
                                    {option.name}
                                </option>)
                            }
                        </Form.Select>
                        ;
                } else {
                    const createInput = (props) => <Form.Control
                        {...props}
                        type={config.type}
                        id={config.id}
                        name={config.name}
                        size="sm"
                    />;
                    if (config.mask) {
                        element =
                            <ReactInputMask mask={config.mask} onChange={config.onChange}>
                                {(inputProps) => createInput(inputProps)}
                            </ReactInputMask>;
                    } else {
                        element = createInput({ onChange: config.onChange });
                    }
                }
                return (
                    <Form.Group
                        className={styles.formGroup}
                        key={config.id}>
                        <Form.Label
                            className={styles.formLabel}
                            htmlFor={config.id}
                        >{config.label}</Form.Label>
                        {element}
                    </Form.Group>
                );
            })}
        </Form>
    );
}

export default DeviceDetailsForm;