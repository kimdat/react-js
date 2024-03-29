import React from "react";
import DeviceDetailsForm from "../DeviceDetailsForm";
import Modal from "../../../../components/common/Modal";
import { MDBBtn } from "mdb-react-ui-kit";
import styles from "./DeviceModal.module.scss";
import {
  useConnectNewDeviceMutation,
  useLazyCheckDuplicateQuery,
} from "../../deviceApiSlice";
import useFormValidator from "../../../../hooks/useFormValidator";
import LoadingComponent from "./../../../../components/LoadingComponent/LoadingComponent";
import { useInputs } from "../../../../hooks/useInputs";
import { fieldNames, deviceSchema } from "../../data/constants";
import { useLazyGetProvincesQuery } from "../../../province/provinceApiSlice";

const DeviceModal = (props) => {
  const {
    open,
    setOpen,
    trigger,
    regions,
    title,
    actionButton,
    actionFunc,
    isLoading,
    connectNewDevice,
    isSuccess,
    isError,
    device,
    alertMessageFire,
    deviceId,
    deviceTypes,
  } = props;

  const [inputs, setInputs, getAllInputs, resetInputs] = useInputs(Object.values(fieldNames), device);

  const [getProvinces] = useLazyGetProvincesQuery();

  const regionId = inputs(fieldNames.REGION_ID);
  const [provinces, setProvinces] = React.useState([]);
  React.useEffect(() => {
    if (open && regionId) {
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
    }
  }, [regionId, getProvinces, open]);

  const [isIpDuplicate, setIsIpDuplicate] = React.useState(false);
  const [isDeviceNameDuplicate, setIsDeviceNameDuplicate] = React.useState(false);
    
  const [checkDuplicate] = useLazyCheckDuplicateQuery();

  const { errors, texts, validate, resetValidator, blurHandler } = useFormValidator(deviceSchema, [
    {
      inputName: fieldNames.IP,
      validateFunc: async (value) => {
        return await checkDuplicate({
          name: fieldNames.IP,
          value,
          id: deviceId
        }).unwrap();
      },
      text: "This ip address already exists."
    },
    {
      inputName: fieldNames.DEVICE_NAME,
      validateFunc: async (value) => {
        return await checkDuplicate({
          name: fieldNames.DEVICE_NAME,
          value,
          id: deviceId
        }).unwrap();
      },
      text: "This device name already exists."
    }
  ]);

  const actionHandler = async () => {
  
    //validation
   
    const input=getAllInputs();
    //trim all value
    Object.keys(input).forEach(k => input[k] = input[k].trim());
    const data = await validate(input);
    if (data === null) return;

    //duplicate check

    const isDeviceNameDuplicate = await checkDuplicate({
      name: fieldNames.DEVICE_NAME,
      value: inputs(fieldNames.DEVICE_NAME),
      id: deviceId
    }).unwrap();
    setIsDeviceNameDuplicate(isDeviceNameDuplicate);
    if (isDeviceNameDuplicate) {
      return;
    }

    const isIpDuplicate = await checkDuplicate({
        name: fieldNames.IP,
        value: inputs(fieldNames.IP),
        id: deviceId
      }).unwrap();
    setIsIpDuplicate(isIpDuplicate);
    if (isIpDuplicate) {
      return;
    }
      
    //post
    try {
      const res = await actionFunc(data).unwrap();
      console.log(res);
      alertMessageFire("success", res.message ? res.message : "Done!");
      //connect api
      if (connectNewDevice) {
        const dataConnect = await connectNewDevice(res.devices).unwrap();
        console.log(dataConnect);
      }
    } catch (err) {
      console.log(err);
      alertMessageFire(
        "error",
        err.message ? err.message : "There was an error."
      );
    }
  };

  const setDuplicateStatesToDefault = () => {
    setIsDeviceNameDuplicate(false);
    setIsIpDuplicate(false);
  };

  React.useEffect(() => {
    resetInputs();
    resetValidator();
    setDuplicateStatesToDefault();
  }, [open]);

  const deviceErrors = (fieldName) => {
    //check duplicate
    if (fieldName === fieldNames.IP && isIpDuplicate) {
      return true;
    }
    if (fieldName === fieldNames.DEVICE_NAME && isDeviceNameDuplicate) {
      return true;
    }
    return errors(fieldName);
  };

  const deviceTexts = (fieldName) => {
    //check duplicate
    if (fieldName === fieldNames.IP && isIpDuplicate) {
      return "This ip address already exists.";
    }
    if (fieldName === fieldNames.DEVICE_NAME && isDeviceNameDuplicate) {
      return "This device name already exists.";
    }
    return texts(fieldName);
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <Modal
        setOpen={setOpen}
        trigger={<span onClick={() => setOpen(!open)}>{trigger}</span>}
        title={title}
        body={
          <div className={styles.addDeviceModalBody}>
            <DeviceDetailsForm
              inputs={inputs}
              setInputs={setInputs}
              regions={regions}
              provinces={provinces}
              errors={deviceErrors}
              texts={deviceTexts}
              deviceTypes={deviceTypes}
              blurHandler={blurHandler}
            />
            <div className={styles.actionButtonList}>
              <MDBBtn
                className={styles.actionButton}
                color="secondary"
                onClick={() => setOpen(!open)}
              >
                Cancel
              </MDBBtn>
              <MDBBtn
                className={styles.actionButton}
                onClick={() => actionHandler()}
              >
                {actionButton}
              </MDBBtn>
            </div>
          </div>
        }
        hideOnClickOutside={false}
        hasCloseButton={false}
        isOpen={open}
      ></Modal>
    </LoadingComponent>
  );
};

export default DeviceModal;
