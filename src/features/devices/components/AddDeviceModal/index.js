import React from "react";
import DeviceDetailsForm from "../DeviceDetailsForm";
import Modal from "../../../../components/common/Modal";
import { MDBBtn } from "mdb-react-ui-kit";
import styles from "./AddDeviceModal.module.scss";
import { useAddNewDeviceMutation } from "../../deviceApiSlice";
import * as Yup from "yup";
import useFormValidator from "../../../../hooks/useFormValidator";
import LoadingComponent from "./../../../../components/LoadingComponent/LoadingComponent";
import Swale from "sweetalert2";

const AddDeviceModal = (props) => {
  const { trigger, provinces, regions } = props;
  const [open, setOpen] = React.useState(false);
  const [deviceName, setDeviceName] = React.useState("");
  const [ipLoopback, setIpLoopback] = React.useState("");
  const [deviceType, setDeviceType] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [province, setProvince] = React.useState("");
  const [long, setLong] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [msg, setMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [addNewDevice, { isLoading1, isSuccess, isError }] =
    useAddNewDeviceMutation();

  const ipAddrRegExp =
    /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;
  const addDeviceSchema = Yup.object().shape({
    DeviceName: Yup.string().required("Device name is required."),
    Ip: Yup.string().matches(ipAddrRegExp, "IP address is invalid."),
    Device_Type: Yup.string().required("Device type is required."),
    region_id: Yup.string().required("Region is required."),
    province_id: Yup.string().required("Province type is required."),
    long: Yup.string(),
    lat: Yup.string(),
  });
  const { errors, texts, validate } = useFormValidator(addDeviceSchema);

  const device = {
    DeviceName: deviceName,
    Ip: ipLoopback,
    Device_Type: deviceType,
    region_id: region,
    province_id: province,
    long,
    lat,
    address,
    username: "epnm",
    password: "epnm@890!",
  };

  const inputChangeHandler = {
    setDeviceName,
    setIpLoopback,
    setDeviceType,
    setRegion,
    setProvince,
    setLong,
    setLat,
    setAddress,
  };
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
    //validation
    const data = await validate(device);
    if (data === null) return;

    //post
    try {
      setIsLoading(true);
      const res = await addNewDevice(data).unwrap();
      setIsLoading(false);
      console.log(res);
      messInforOneDevice(res);
      // setOpen(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setMsg("");
      if (!err.success) {
        setMsg(err.data.errors?.join("</br>"));
      } else {
        setMsg("There are something wrong.");
      }
    }
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <Modal
        setOpen={setOpen}
        trigger={<span onClick={() => setOpen(!open)}>{trigger}</span>}
        title="Add a new device"
        body={
          <div className={styles.addDeviceModalBody}>
            <DeviceDetailsForm
              device={device}
              inputChangeHandlers={inputChangeHandler}
              regions={regions}
              provinces={provinces}
              errors={errors}
              texts={texts}
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
