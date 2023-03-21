import React from 'react';
import DeviceModal from '../DeviceModal';
import { useAddNewDeviceMutation } from "../../deviceApiSlice";

const AddDeviceModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const { trigger, provinces, regions } = props;
  const [addNewDevice, { isLoading, isSuccess, isError }] =
    useAddNewDeviceMutation();
  return (
    <DeviceModal
      open={ open}
      setOpen={ setOpen }
      trigger={trigger}
      provinces={provinces}
      regions={regions}
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      title="Add a new device"
      actionButton="Add"
      actionFunc={(data) => addNewDevice(data)}
    />
  );
}

export default AddDeviceModal;