import React from "react";
import DeviceDetailsForm from "../DeviceDetailsForm";
import Modal from "../../../../components/common/Modal";
import { MDBBtn } from "mdb-react-ui-kit";
import styles from "./AddDeviceModal.module.scss";
import { useAddNewDeviceMutation, useLazyCheckDuplicateQuery } from "../../deviceApiSlice";
import * as Yup from "yup";
import useFormValidator from "../../../../hooks/useFormValidator";
import LoadingComponent from "./../../../../components/LoadingComponent/LoadingComponent";
import Swale from "sweetalert2";
import { useInputs } from "../../../../hooks/useInputs";
import { fieldNames } from "../../data/constants";

const AddDeviceModal = (props) => {
  const { trigger, provinces, regions } = props;
  const [open, setOpen] = React.useState(false);

  const [inputs, setInputs, getAllInputs, resetInputs] = useInputs(Object.values(fieldNames));

  const [isIpDuplicate, setIsIpDuplicate] = React.useState(false);
  const [isDeviceNameDuplicate, setIsDeviceNameDuplicate] = React.useState(false);

  const [msg, setMsg] = React.useState("");
  const [addNewDevice, { isLoading, isSuccess, isError }] =
    useAddNewDeviceMutation();
  const [checkDuplicate] = useLazyCheckDuplicateQuery();

  const ipAddrRegExp =
    /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;
  const addDeviceSchema = Yup.object().shape({
    [fieldNames.DEVICE_NAME]: Yup.string().required("Device name is required."),
    [fieldNames.IP]: Yup.string().matches(ipAddrRegExp, 'IP address is invalid.'),
    [fieldNames.DEVICE_TYPE]: Yup.string().required("Device type is required."),
    [fieldNames.REGION_ID]: Yup.string().required("Region is required."),
    [fieldNames.PROVINCE_ID]: Yup.string().required("Province type is required."),
    [fieldNames.LONG]: Yup.string(),
    [fieldNames.LAT]: Yup.string(),
    [fieldNames.ADDRESS]: Yup.string(),
  });
  const { errors, texts, validate, resetValidator } = useFormValidator(addDeviceSchema);

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
      const res = await addNewDevice(data).unwrap();
      setOpen(false);
      messInforOneDevice(res);
    } catch (err) {
      setMsg("");
      if (!err.success) {
        setMsg(err.data.errors?.join("</br>"));
      } else {
        setMsg("There are something wrong.");
      }
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

  console.log(open);

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
        title="Add a new device"
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
                Add
              </MDBBtn>
            </div>
          </div>
        }
        hideOnClickOutside={true}
        hasCloseButton={false}
        isOpen={open}
      ></Modal>{" "}
    </LoadingComponent>
  );
};

export default AddDeviceModal;
