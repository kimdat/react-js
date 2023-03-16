import React, { useState } from "react";
import DeviceDetailsForm from "../DeviceDetailsForm";
import Modal from "../../../../components/common/Modal";
import { MDBBtn } from "mdb-react-ui-kit";
import styles from "./AddDeviceModal.module.scss";
import DataCreateUpdate from "../DataCreateUpdate";

const AddDeviceModal = (props) => {
  const { trigger } = props;
  const [inputs, setInputs] = useState({});

  const [open, setOpen] = React.useState(false);
  return (
    <Modal
      trigger={<span onClick={() => setOpen(!open)}>{trigger}</span>}
      title="Add a new device"
      body={
        <div className={styles.addDeviceModalBody}>
          <DeviceDetailsForm inputs={inputs} setInputs={setInputs} />
          <div className={styles.actionButtonList}>
            <MDBBtn
              className={styles.actionButton}
              color="secondary"
              onClick={() => setOpen(!open)}
            >
              Cancel
            </MDBBtn>
            <div className={styles.actionButton}>
              <DataCreateUpdate device_list={[inputs]} />
            </div>
          </div>
        </div>
      }
      hideOnClickOutside={false}
      hasCloseButton={false}
      isOpen={open}
    ></Modal>
  );
};

export default AddDeviceModal;
