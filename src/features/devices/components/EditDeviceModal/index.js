import React from 'react';
import DeviceModal from '../DeviceModal';
import { useEditDeviceMutation } from "../../deviceApiSlice";

const EditDeviceModal = (props) => {
  const { provinces, regions, open, setOpen, deviceId, device } = props;
  const [editDevice, { isLoading, isSuccess, isError }] =
    useEditDeviceMutation();
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
      actionFunc={(data) => editDevice(deviceId, data)}
      device={device}
    />
  );
}

export default EditDeviceModal;