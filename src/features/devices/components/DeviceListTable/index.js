import React from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import styles from "./DeviceListTable.module.scss";
import classNames from "classnames";
// import { deviceStatus, region, province } from '../../data/constants';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmarkCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";

const cx = classNames.bind(styles);

const TextFilter = ({ id, label }) => (
  <Form.Group className={styles.textFilter}>
    <Form.Label htmlFor={id}>{label}</Form.Label>
    <Form.Control id={id} type="text" size="sm"></Form.Control>
  </Form.Group>
);

const SelectFilter = ({ id, label, options }) => (
  <Form.Group className={styles.selectFilter}>
    <Form.Label htmlFor={id}>{label}</Form.Label>
    <Form.Select id={id} name={label} size="sm">
      <option defaultValue={"all"}>All</option>
      {options?.map((option, idx) => (
        <option key={idx} value={option.id}>
          {option.name}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);

const DeviceListTable = (props) => {
  const {
    deviceList,
    isSelectAll,
    selectAllToggleFunc,
    selectRowToggleFunc,
    deviceStatus,
    regions,
    provinces,
  } = props;

  const columns = [
    { id: "number", label: "No.", filterType: "text", width: 5, minWidth: 5 },
    {
      id: "deviceName",
      label: "Device Name",
      filterType: "text",
      width: 20,
      minWidth: 15,
    },
    {
      id: "ip",
      label: "IP Loopback",
      filterType: "text",
      width: 20,
      minWidth: 15,
    },
    {
      id: "status",
      label: "Status",
      filterType: "select",
      options: deviceStatus,
      width: 20,
      minWidth: 13,
    },
    {
      id: "region",
      label: "Region",
      filterType: "select",
      options: regions,
      width: 20,
      minWidth: 10,
    },
    {
      id: "province",
      label: "Province",
      filterType: "select",
      options: provinces,
      width: 20,
      minWidth: 10,
    },
    { id: "long", label: "Long.", filterType: "text", width: 10, minWidth: 5 },
    { id: "lat", label: "Lat.", filterType: "text", width: 10, minWidth: 5 },
    {
      id: "address",
      label: "Address",
      filterType: "text",
      width: 35,
      minWidth: 20,
    },
  ];

  const rows = deviceList
    ? deviceList.map((d, idx) => {
        return {
          id: d.Id,
          isSelected: d.isSelected,
          number: idx + 1,
          deviceName: d.DeviceName,
          ip: d.Ip,
          status: d.status,
          region: d.region_id,
          province: d.province_id,
          long: d.long,
          lat: d.lat,
          address: d.address,
        };
      })
    : [];
  return (
    <>
      {rows.length === 0 && <div>There are no devices.</div>}
      {rows.length !== 0 && (
        <MDBTable
          striped
          small
          hover
          className={cx(styles.deviceListTable, "w-auto")}
        >
          <MDBTableHead className={styles.deviceListTableHead}>
            <tr>
              <th scope="col" className={styles.deviceListTableHeadCell}>
                <MDBCheckbox
                  checked={isSelectAll || false}
                  onChange={() => selectAllToggleFunc()}
                ></MDBCheckbox>
              </th>
              {columns.map((col, idx) => (
                <th
                  scope="col"
                  key={idx}
                  className={styles.deviceListTableHeadCell}
                >
                  {col.filterType === "text" && (
                    <div
                      className={styles.deviceListTableCol}
                      style={{
                        width: `${col.width}ch`,
                        minWidth: `${col.minWidth}ch`,
                      }}
                    >
                      <TextFilter id={col.id} label={col.label} />
                    </div>
                  )}
                  {col.filterType === "select" && (
                    <div
                      className={styles.deviceListTableCol}
                      style={{
                        width: `${col.width}ch`,
                        minWidth: `${col.minWidth}ch`,
                      }}
                    >
                      <SelectFilter
                        id={col.id}
                        label={col.label}
                        options={col.options}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {rows.map((row, idx) => (
              <tr key={idx} className={cx({ "table-primary": row.isSelected })}>
                <th scope="col">
                  <MDBCheckbox
                    checked={row.isSelected || false}
                    onChange={() => selectRowToggleFunc(row.id)}
                  ></MDBCheckbox>
                </th>
                <td>{row.number}</td>
                <td>{row.deviceName}</td>
                <td>{row.ip}</td>
                <td>
                  {row.status === "M" ? (
                    <div className={styles.statusIcon}>
                      <FontAwesomeIcon
                        className="text-success"
                        icon={faCheckCircle}
                      />
                    </div>
                  ) : (
                    <div className={styles.statusIcon}>
                      <FontAwesomeIcon
                        className="text-danger"
                        icon={faXmarkCircle}
                      />
                    </div>
                  )}
                  {
                    deviceStatus?.find((status) => status.value === row.status)
                      ?.name
                  }
                </td>
                <td>{row.region}</td>
                <td>{row.province}</td>
                <td>{row.long}</td>
                <td>{row.lat}</td>
                <td>{row.address}</td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      )}
    </>
  );
};

export default DeviceListTable;
