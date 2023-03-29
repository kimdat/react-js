import React from 'react';
import DeviceModal from '../DeviceModal';
import { useEditDeviceMutation } from "../../deviceApiSlice";
import Swal from 'sweetalert2';

const EditDeviceModal = (props) => {
  const { provinces, regions, open, setOpen, deviceId, device } = props;
  const [editDevice, { isLoading, isSuccess, isError }] =
    useEditDeviceMutation();
  
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
      provinces={provinces}
      regions={regions}
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      title="Modify device info"
      actionButton="Update"
      actionFunc={(data) => editDevice({deviceId, data})}
      device={device}
      alertMessageFire={alertMessageFire}
      deviceId={deviceId}
    />
  );
}

export default EditDeviceModal;