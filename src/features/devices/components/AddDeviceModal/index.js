import React from 'react';
import DeviceDetailsForm from '../DeviceDetailsForm';
import Modal from '../../../../components/common/Modal';
import { MDBBtn } from 'mdb-react-ui-kit';
import styles from './AddDeviceModal.module.scss';

const AddDeviceModal = (props) => {
  const { trigger } = props;
  const [ open, setOpen ] = React.useState(false);
  return (
    <Modal
      trigger={
        <span onClick={() => setOpen(!open)}>
          {trigger}
        </span>
      }
      title="Add a new device"
      body={
        <div className={styles.addDeviceModalBody}>
          <DeviceDetailsForm />
          <div className={styles.actionButtonList}>
            <MDBBtn
              className={styles.actionButton}
              color='secondary'
              onClick={() => setOpen(!open)}
            >
              Cancel
            </MDBBtn>
            <MDBBtn
              className={styles.actionButton}
            >
              Add
            </MDBBtn>
          </div>
        </div>
      }
      hideOnClickOutside={false}
      hasCloseButton={false}
      isOpen={open}
    ></Modal>
  );
}

export default AddDeviceModal;