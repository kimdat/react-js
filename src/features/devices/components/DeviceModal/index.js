import React from "react";
import DeviceDetailsForm from "../DeviceDetailsForm";
import Modal from "../../../../components/common/Modal";
import { MDBBtn } from "mdb-react-ui-kit";
import styles from "./DeviceModal.module.scss";
import { useLazyCheckDuplicateQuery } from "../../deviceApiSlice";
import useFormValidator from "../../../../hooks/useFormValidator";
import LoadingComponent from "./../../../../components/LoadingComponent/LoadingComponent";
import Swale from "sweetalert2";
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
  } = props;

  const [inputs, setInputs, getAllInputs, resetInputs] = useInputs(Object.values(fieldNames), device);

  const [isIpDuplicate, setIsIpDuplicate] = React.useState(false);
  const [isDeviceNameDuplicate, setIsDeviceNameDuplicate] = React.useState(false);

  const [msg, setMsg] = React.useState("");
    
  const [checkDuplicate] = useLazyCheckDuplicateQuery();

  const { errors, texts, validate, resetValidator } = useFormValidator(deviceSchema);

  const EditCreate = "Add";
  const messInforOneDevice = (data) => {
    const dataFail = data.fail;
    const dataErr = data.Err;
    const title =
      dataErr.length > 0 ? "Err" : dataFail.length > 0 ? "Fail" : "Success";
    const icon = dataErr.length > 0 || dataFail.length ? "error" : "success";
    const html =
      dataErr.length > 0
        ? `Error when ${EditCreate} device`
        : dataFail.length > 0
        ? `connect fail for:${dataFail[0].ip}`
        : `${EditCreate} success`;
    Swale.fire({
      title,
      icon,
      html,
    });
};
  
    const handleAddDevice = async () => {
    //duplicate check
    const isDeviceNameDuplicate = await checkDuplicate({ deviceName: inputs([fieldNames.DEVICE_NAME]) }).unwrap();
    setIsDeviceNameDuplicate(isDeviceNameDuplicate);
    if (isDeviceNameDuplicate) {
      return;
    }

    const isIpDuplicate = await checkDuplicate({ ip: inputs([fieldNames.IP]) }).unwrap();
    setIsIpDuplicate(isIpDuplicate);
    if (isIpDuplicate) {
      return;
    }

    //validation
    const data = await validate(getAllInputs());
    if (data === null) return;

    //post
    try {
      const res = await actionFunc(data).unwrap();
      setOpen(false);
      messInforOneDevice(res);
    } catch (err) {
      setMsg("");
      // if (!err.success) {
      //   setMsg(err.data.errors?.join("</br>"));
      // } else {
      //   setMsg("There are something wrong.");
      // }
    }
  };

  const setDuplicateStatesToDefault = () => {
    setIsDeviceNameDuplicate(false);
    setIsIpDuplicate(false);
  }

  React.useEffect(() => {
    resetInputs();
    resetValidator();
    setDuplicateStatesToDefault();
  }, [open]);

  const addDeviceErrors = (fieldName) => {
    //check duplicate
    if (fieldName === fieldNames.IP && isIpDuplicate) {
      return true;
    }
    if (fieldName === fieldName.DEVICE_NAME && isDeviceNameDuplicate) {
      return true;
    }
    return errors(fieldName);
  }

  const addDeviceTexts = (fieldName) => {
    //check duplicate
    if (fieldName === fieldNames.IP && isIpDuplicate) {
      return "This ip address already exists.";
    }
    if (fieldName === fieldNames.DEVICE_NAME && isDeviceNameDuplicate) {
      return "This device name already exists.";
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
              errors={addDeviceErrors}
              texts={addDeviceTexts}
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
                onClick={() => handleAddDevice()}
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
