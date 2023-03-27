import React from "react";
import DeviceDetailsForm from "../DeviceDetailsForm";
import Modal from "../../../../components/common/Modal";
import { MDBBtn } from "mdb-react-ui-kit";
import styles from "./DeviceModal.module.scss";
import { useLazyCheckDuplicateQuery } from "../../deviceApiSlice";
import useFormValidator from "../../../../hooks/useFormValidator";
import LoadingComponent from "./../../../../components/LoadingComponent/LoadingComponent";
import { useInputs } from "../../../../hooks/useInputs";
import { fieldNames, deviceSchema } from "../../data/constants";

const DeviceModal = (props) => {
  const {
    open,
    setOpen,
    trigger,
    provinces,
    regions,
    title,
    actionButton,
    actionFunc,
    isLoading,
    isSuccess,
    isError,
    device,
    hasDuplicateValidation,
    alertMessageFire,
  } = props;

  const [inputs, setInputs, getAllInputs, resetInputs] = useInputs(Object.values(fieldNames), device);

  const [isIpDuplicate, setIsIpDuplicate] = React.useState(false);
  const [isDeviceNameDuplicate, setIsDeviceNameDuplicate] = React.useState(false);
    
  const [checkDuplicate] = useLazyCheckDuplicateQuery();

  const { errors, texts, validate, resetValidator } = useFormValidator(deviceSchema);

  const actionHandler = async () => {
    //validation
    const data = await validate(getAllInputs());
    if (data === null) return;
    
    //duplicate check
    if (hasDuplicateValidation) {
      const isDeviceNameDuplicate = await checkDuplicate({ deviceName: inputs(fieldNames.DEVICE_NAME) }).unwrap();
      setIsDeviceNameDuplicate(isDeviceNameDuplicate);
      if (isDeviceNameDuplicate) {
        return;
      }

      const isIpDuplicate = await checkDuplicate({ ip: inputs(fieldNames.IP) }).unwrap();
      setIsIpDuplicate(isIpDuplicate);
      if (isIpDuplicate) {
        return;
      }
    }
      
    //post
    try {
      const res = await actionFunc(data).unwrap();
      console.log(res);
      alertMessageFire("success",res.message? res.message : "Done!");
    } catch (err) {
      console.log(err);
      alertMessageFire("error", err.message? err.message : "There was an error.");
    }
  };

  const setDuplicateStatesToDefault = () => {
    setIsDeviceNameDuplicate(false);
    setIsIpDuplicate(false);
  }

  React.useEffect(() => {
    resetInputs();
    resetValidator();
    if (hasDuplicateValidation) {
      setDuplicateStatesToDefault();
    }
  }, [open]);

  const deviceErrors = (fieldName) => {
    //check duplicate
    if (hasDuplicateValidation) {
      if (fieldName === fieldNames.IP && isIpDuplicate) {
        return true;
      }
      if (fieldName === fieldNames.DEVICE_NAME && isDeviceNameDuplicate) {
        return true;
      }
    }
    return errors(fieldName);
  }

  const deviceTexts = (fieldName) => {
    //check duplicate
    if (hasDuplicateValidation) {
      if (fieldName === fieldNames.IP && isIpDuplicate) {
        return "This ip address already exists.";
      }
      if (fieldName === fieldNames.DEVICE_NAME && isDeviceNameDuplicate) {
        return "This device name already exists.";
      }
    }
    return texts(fieldName);
  }

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
