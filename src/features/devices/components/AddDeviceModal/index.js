import React from "react";
import DeviceModal from "../DeviceModal";
import {
  useAddNewDeviceMutation,
  useConnectNewDeviceMutation,
} from "../../deviceApiSlice";
import Swal from "sweetalert2";

const AddDeviceModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const { trigger, provinces, regions } = props;
  const [addNewDevice, { isLoading, isSuccess, isError }] =
    useAddNewDeviceMutation();
  const [connectNewDevice] = useConnectNewDeviceMutation();
  const alertMessageFire = (status, msg) => {
    Swal.fire({
      icon: status,
      title: status,
      text: msg,
    });
  };

  return (
    <DeviceModal
      open={open}
      setOpen={setOpen}
      trigger={trigger}
      provinces={provinces}
      regions={regions}
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      title="Add a new device"
      actionButton="Add"
      actionFunc={(data) => addNewDevice(data)}
      connectNewDevice={(data) => connectNewDevice(data)}
      hasDuplicateValidation={true}
      alertMessageFire={alertMessageFire}
    />
  );
};

export default AddDeviceModal;
