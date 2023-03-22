import React from "react";
import DeviceListTable from "./components/DeviceListTable";
import styles from "./DeviceManagementPage.module.scss";
import { MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faXmark, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import AddDeviceModal from "./components/AddDeviceModal";
import {
  useDeleteDevicesMutation,
  useLazyGetDevicesQuery,
} from "./deviceApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDeviceList,
  selectFilters,
  selectAllToggle,
  selectRowToggle,
  setCurrentPage,
  setRowsPerPage,
  selectTotalRowCount,
  setFilter,
} from "./deviceSlice";
import { useGetAllProvincesQuery } from "../province/provinceApiSlice";
import { useGetAllRegionsQuery } from "../region/regionApiSlice";
import { useGetAllDeviceStatusQuery } from "../deviceStatus/deviceStatusApiSlice";
import Swal from "sweetalert2";
import EditDeviceModal from "./components/EditDeviceModal";

const DeviceManagementPage = (props) => {
  const [editDeviceModalOpen, setEditDeviceModalOpen] = React.useState(false);
  const [editDeviceId, setEditDeviceId] = React.useState(null);
  //gọi api trả về các devices
  const [getDevices,
    {
      isFetching: devicesFetching,
      isError: devicesError,
      isSuccess: devicesSuccess,
    }
  ] = useLazyGetDevicesQuery();
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
  
  //
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
  const totalRowCount = useSelector(selectTotalRowCount);

  React.useEffect(() => {
    getDevices(filters);
  }, [filters, getDevices]);

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

  const onRowClickHandler = (id) => {
    setEditDeviceId(id);
    setEditDeviceModalOpen(true);
  }

  const getDeviceById = (id) => devices.find((device) => device.Id === id);

  return (
    <>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Device Management</h1>
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
              <MDBBtn
                className={styles.actionButton}
                type="button"
                size="sm"
                color="info"
              >
                <div className={styles.buttonIcon}>
                  <FontAwesomeIcon icon={faFileExcel} />
                </div>
                Export
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
                  setFilter={(value) => dispatch(setFilter(value))}
                  onRowClickHandler={onRowClickHandler}
                  currentPage={filters.currentPage}
                  rowsPerPage={filters.rowsPerPage}
                  setRowsPerPage={(value) => dispatch(setRowsPerPage(value))}
                  setCurrentPage={(value) => dispatch(setCurrentPage(value))}
                  totalRowCount={totalRowCount}
                />
              )}
              {isError && <div>There are no devices.</div>}
            </div>
          </MDBCardBody>
        </MDBCard>
      </div>
      <EditDeviceModal
        provinces={provinces}
        regions={regions}
        open={editDeviceModalOpen}
        setOpen={setEditDeviceModalOpen}
        deviceId={editDeviceId}
        device={getDeviceById(editDeviceId)}
      />
    </>
  );
};

export default DeviceManagementPage;
