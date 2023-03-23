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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import Pagination from '../../../../components/common/Pagination';
import { fieldNames } from '../../data/constants';

const cx = classNames.bind(styles);

const PageSizeSelector = (props) => {
    const { onSizeChange, pageSizes } = props;
    return (
        <Form.Group className={styles.pageSizeSelectorWrapper}>
            <label htmlFor="page-selector">Rows per page:</label>
            <Form.Select id="page-selector" size="sm" onChange={
                (e) => onSizeChange(Number.parseInt(e.target.value))}>
                {pageSizes.map((size, idx) => 
                    <option key={idx} value={size}>{size}</option>
                )}
            </Form.Select>
        </Form.Group>
    );
}

const TextFilter = ({ id, label, onEnterKeyDown }) => 
{
    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            onEnterKeyDown(id, e.target.value);
        }
    }
    return (
        <Form.Group className={styles.textFilter}>
            <Form.Label htmlFor={id}>{label}</Form.Label>
            <Form.Control id={id} type="text" size="sm"
                onKeyDown={onKeyDown}
            ></Form.Control>
        </Form.Group>
    );
}

const SelectFilter = ({ id, label, options, onChange }) => 
    <Form.Group className={styles.selectFilter}>
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Select id={id} name={label} size="sm" onChange={(e) => onChange(id, e.target.value)}>
            <option value="">All</option>
            {options?.map((option, idx) => 
                <option key={idx} value={option.id}>{option.name}</option>
            )}
        </Form.Select>
    </Form.Group>
    
const DeviceListTable = (props) => {
    const {
        deviceList,
        isSelectAll,
        selectAllToggleFunc,
        selectRowToggleFunc,
        deviceStatus,
        regions,
        provinces,
        onRowClickHandler,
        filters,
        setFilter,
        currentPage,
        rowsPerPage,
        setRowsPerPage,
        setCurrentPage,
        totalRowCount,
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
            id: d[fieldNames.ID],
            isSelected: d.isSelected,
            number: rowsPerPage * (currentPage - 1) + idx + 1,
            deviceName: d[fieldNames.DEVICE_NAME],
            ip: d[fieldNames.IP],
            deviceType: d[fieldNames.DEVICE_TYPE],
            status: d[fieldNames.STATUS],
            region: d[fieldNames.REGION_ID],
            province: d[fieldNames.PROVINCE_ID],
            long: d[fieldNames.LONG],
            lat: d[fieldNames.LAT],
            address: d[fieldNames.ADDRESS],
        };
    }) : [];

    const getOptionNameById = (id, options) => {
        return options?.find((option) => option.id == id)?.name;
    }

    return (
        <>
            <MDBTable striped small hover
                    className={cx(styles.deviceListTable, 'w-auto')}
                >
                <MDBTableHead className={styles.deviceListTableHead}>
                    <tr>
                        <th scope='col' className={styles.deviceListTableHeadCell}>
                            <MDBCheckbox checked={isSelectAll || false}
                                onChange={() => selectAllToggleFunc()}></MDBCheckbox>
                        </th>
                        {columns.map((col, idx) => 
                            <th scope='col'
                                key={idx}
                                className={styles.deviceListTableHeadCell}
                            >
                                {col.filterType === "text" && 
                                    <div className={styles.deviceListTableCol}
                                        style={{
                                            width: `${col.width}ch`,
                                            minWidth: `${col.minWidth}ch`,
                                        }}>
                                        <TextFilter
                                            id={col.id}
                                            label={col.label}
                                            onEnterKeyDown={(name, value) => setFilter({
                                                filterName: name, filterValue: value
                                            })}
                                        />
                                    </div>
                                }
                                {col.filterType === "select" &&
                                    <div className={styles.deviceListTableCol}
                                        style={{
                                            width: `${col.width}ch`,
                                            minWidth: `${col.minWidth}ch`,
                                        }}>
                                        <SelectFilter
                                            id={col.id}
                                            label={col.label}
                                            options={col.options}
                                            onChange={(name, value) => setFilter({
                                                filterName: name, filterValue: value,
                                            })}
                                            />
                                    </div>
                                }
                            </th>
                        )}
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {rows.length === 0 && 
                        <tr>
                            <td colSpan={columns.length} className={styles.noDevicesMessage}>
                                There are no devices.
                            </td>
                        </tr>
                    }
                    {rows.length !== 0 && rows.map((row, idx) => 
                        <tr key={idx}
                            className={cx(
                                styles.deviceListTableRow,
                                {"table-primary": row.isSelected}
                            )}
                            
                        >
                            <th scope='col'>
                                <MDBCheckbox checked={row.isSelected || false}
                                    onChange={() => selectRowToggleFunc(row.id)}
                                ></MDBCheckbox>
                            </th>
                            <td>{row.number}</td>
                            <td className={styles.deviceName}>
                                <button onClick={() => onRowClickHandler(row.id)}>
                                    {row.deviceName}
                                </button>
                            </td>
                            <td>{row.ip}</td>
                            <td>{row.deviceType}</td>
                            <td>
                                {
                                    row.status === '1'
                                    ? <div className={styles.statusIcon}><FontAwesomeIcon className="text-success" icon={faCheckCircle} /></div>
                                    : <div className={styles.statusIcon}><FontAwesomeIcon className="text-danger" icon={faXmarkCircle} /></div>
                                }
                                {
                                    deviceStatus?.find(status => status.id === row.status)?.name
                                }
                            </td>
                            <td>{getOptionNameById(row.region, regions)}</td>
                            <td>{getOptionNameById(row.province, provinces)}</td>
                            <td>{row.long}</td>
                            <td>{row.lat}</td>
                            <td>{row.address}</td>
                        </tr>
                    )}
                </MDBTableBody>
            </MDBTable>
            <div className={styles.paginationWrapper}>
                <PageSizeSelector
                    onSizeChange={setRowsPerPage}
                    pageSizes={[10, 15, 20, 25, 30]}
                />
                <Pagination
                    className={styles.pagination}
                    onPageChange={setCurrentPage}
                    totalCount={totalRowCount}
                    siblingCount={0}
                    currentPage={currentPage}
                    pageSize={rowsPerPage}
                />
            </div>
        </>
    );
}

export default DeviceListTable;
