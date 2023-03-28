import React from "react";
import DeviceListTable from "./components/DeviceListTable";
import styles from "./DeviceManagementPage.module.scss";
import { MDBBtn } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import { useLazyGetProvincesQuery } from "../province/provinceApiSlice";
import { useGetAllRegionsQuery } from "../region/regionApiSlice";
import { useGetAllDeviceStatusQuery } from "../deviceStatus/deviceStatusApiSlice";
import Swal from "sweetalert2";
import EditDeviceModal from "./components/EditDeviceModal";
import "../../pages/Datatable.css";
import { fieldNames } from "./data/constants";

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
  const [getProvinces,
    {
      isFetching: provincesFetching,
      isError: provincesError,
      isSuccess: provincesSuccess,
    }
  ] = useLazyGetProvincesQuery();
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

  //provinces
  const regionId = filters[fieldNames.REGION_ID];
  const [provinces, setProvinces] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      let provinces = [];
      let params = {};
      if (regionId) {
        params[fieldNames.REGION_ID] = regionId;
      }
      provinces = await getProvinces(params).unwrap();
      setProvinces(provinces);
    }
    fetchData();
  }, [regionId, getProvinces]);

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
    <div className={styles.pageWrapper}>
      <div className={styles.actionsWrapper}>
        {/* action buttons */}
        <AddDeviceModal
          regions={regions}
          trigger={
            <MDBBtn
              type="button"
              size="sm"
              color="primary"
            >
              <div className={styles.buttonIcon}>
                <FontAwesomeIcon icon={faPlus} />
              </div>
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
            <FontAwesomeIcon icon={faTrash} />
          </div>
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
            className={styles.table}
          />
        )}
        {isError && <div>There are no devices.</div>}
      </div>
      <EditDeviceModal
        regions={regions}
        open={editDeviceModalOpen}
        setOpen={setEditDeviceModalOpen}
        deviceId={editDeviceId}
        device={getDeviceById(editDeviceId)}
      />
    </div>
  );
};

export default DeviceManagementPage;
