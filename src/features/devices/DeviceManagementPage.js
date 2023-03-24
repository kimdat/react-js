import React from "react";
import DeviceListTable from "./components/DeviceListTable";
import styles from "./DeviceManagementPage.module.scss";
import "./device.css";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBContainer,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faXmark, faPencil } from "@fortawesome/free-solid-svg-icons";
import AddDeviceModal from "./components/AddDeviceModal";
import {
  useDeleteDevicesMutation,
  useGetAllDevicesQuery,
} from "./deviceApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDeviceList,
  selectFilters,
  selectAllToggle,
  selectRowToggle,
} from "./deviceSlice";
import { useGetAllProvincesQuery } from "../province/provinceApiSlice";
import { useGetAllRegionsQuery } from "../region/regionApiSlice";
import { useGetAllDeviceStatusQuery } from "../deviceStatus/deviceStatusApiSlice";

const DeviceManagementPage = (props) => {
  //gọi api trả về các devices
  const {
    _,
    isFetching: devicesFetching,
    isError: devicesError,
    isSuccess: devicesSuccess,
  } = useGetAllDevicesQuery();
  const {
    data: provinces,
    isFetching: provincesFetching,
    isError: provincesError,
    isSuccess: provincesSuccess,
  } = useGetAllProvincesQuery();
  const {
    data: regions,
    isFetching: regionsFetching,
    isError: regionsError,
    isSuccess: regionsSuccess,
  } = useGetAllRegionsQuery();
  const {
    data: deviceStatus,
    isFetching: deviceStatusFetching,
    isError: deviceStatusError,
    isSuccess: deviceStatusSuccess,
  } = useGetAllDeviceStatusQuery();

  const [deleteDevices, {}] = useDeleteDevicesMutation();

  const isLoading =
    devicesFetching ||
    provincesFetching ||
    regionsFetching ||
    deviceStatusFetching;
  const isSuccess =
    devicesSuccess || provincesSuccess || regionsSuccess || deviceStatusSuccess;
  const isError =
    devicesError || provincesError || regionsError || deviceStatusError;

  const dispatch = useDispatch();

  //sample data
  // const devices = [
  //     {
  //         deviceName: "ABC-123",
  //         ip: "10.0.0.1",
  //         status: "U",
  //         region: "region",
  //         province: "province",
  //         long: "long",
  //         lat: "lat",
  //         address: "address",
  //     },
  //     {
  //         deviceName: "ABC-234",
  //         ip: "10.0.0.2",
  //         status: "M",
  //         region: "region",
  //         province: "province",
  //         long: "long",
  //         lat: "lat",
  //         address: "address",
  //     },
  //     {
  //         deviceName: "ABC-345",
  //         ip: "10.0.0.3",
  //         status: "U",
  //         region: "region",
  //         province: "province",
  //         long: "long",
  //         lat: "lat",
  //         address: "address",
  //     },
  //     {
  //         deviceName: "ABC-456",
  //         ip: "10.0.0.4",
  //         status: "U",
  //         region: "region",
  //         province: "province",
  //         long: "long",
  //         lat: "lat",
  //         address: "address",
  //     },
  // ]

  //page states

  //reducer
  const devices = useSelector(selectDeviceList);
  const isSelectAll = useSelector((state) => state);
  console.log(isSelectAll);
  const hasNoRowSelected = devices
    ? devices.every((device) => device.isSelected === false)
    : true;
  const filters = useSelector(selectFilters);
  const selectedDeviceIdList = devices
    .filter((device) => device.isSelected === true)
    .map((device) => device.Id);
  return (
    <MDBCard className="bg-white card-name">
      <MDBCardBody>
        <div className={styles.actionsWrapper}>
          {/* action buttons */}
          <AddDeviceModal
            provinces={provinces}
            regions={regions}
            trigger={
              <MDBBtn
                className={styles.actionButton}
                type="button"
                size="sm"
                color="primary"
              >
                <div className={styles.buttonIcon}>
                  <FontAwesomeIcon icon={faAdd} />
                </div>
                Add
              </MDBBtn>
            }
          />
          <MDBBtn
            className={styles.actionButton}
            type="button"
            size="sm"
            color="danger"
            disabled={hasNoRowSelected}
            onClick={() => deleteDevices(selectedDeviceIdList)}
          >
            <div className={styles.buttonIcon}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
            Delete
          </MDBBtn>
        </div>
        <div className={styles.pageContent}>
          {isSuccess && (
            <DeviceListTable
              deviceList={devices}
              isSelectAll={isSelectAll}
              selectAllToggleFunc={() => dispatch(selectAllToggle())}
              selectRowToggleFunc={(ip) => dispatch(selectRowToggle(ip))}
              deviceStatus={deviceStatus}
              regions={regions}
              provinces={provinces}
              filters={filters}
            />
          )}
          {isError && <div>There are no devices.</div>}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default DeviceManagementPage;
