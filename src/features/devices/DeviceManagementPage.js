import React from "react";
import DeviceListTable from "./components/DeviceListTable";
import styles from "./DeviceManagementPage.module.scss";
import { MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
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
import Swal from "sweetalert2";

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

  const [deleteDevices, {
    isError: deleteDeviceError,
    isSuccess: deleteDeviceSuccess,
  }] = useDeleteDevicesMutation();

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
  
  const devices = useSelector(selectDeviceList);
  const isSelectAll = useSelector((state) => state.device.isSelectAll);
  const hasNoRowSelected = devices
    ? devices.every((device) => device.isSelected === false)
    : true;
  const filters = useSelector(selectFilters);

  const selectedDeviceList = devices.filter((device) => device.isSelected === true);
  const selectedDeviceIdList = selectedDeviceList.map((device) => device.Id);
  const selectedDeviceNameList = selectedDeviceList.map((device) => device.DeviceName);
  const nameListToHtmlHelper = (list) => list.toString();
  
  const deleteDeviceHandler = () => {
    Swal.fire({
      title: `Do you want to delete these devices?`,
      text: `${nameListToHtmlHelper(selectedDeviceNameList)}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const deleteResult = deleteDevices(selectedDeviceIdList).unwrap();
        } catch (err) {
          console.log(err);
        }
        if (deleteDeviceSuccess) {
          Swal.fire('Deleted!', '', 'success')
        }
        if (deleteDeviceError) {
          Swal.fire("Error", '')
        }
      }
    });
  }
  return (
    <div className={styles.pageContainer}>
      <MDBCard>
        <MDBCardBody>
          <div className={styles.actionsWrapper}>
            {/* action buttons */}
            <AddDeviceModal
              provinces={provinces}
              regions={regions}
              trigger={
                <MDBBtn
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
              onClick={() => deleteDeviceHandler()}
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
    </div>
  );
};

export default DeviceManagementPage;
