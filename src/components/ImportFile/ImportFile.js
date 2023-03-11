import React, { useState, memo, lazy } from "react";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
const ModalFileUpload = lazy(() =>
  import("../ModalFileUpload/ModalFileUpload")
);

const ImportFile = memo(({ loadData }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <React.Suspense fallback={<div></div>}>
      <>
        <Button
          variant="primary"
          style={{ borderRadius: "10px" }}
          onClick={handleShow}
        >
          <div>
            <FaPlus />
          </div>
        </Button>
        {show && (
          <ModalFileUpload
            show={show}
            handleClose={handleClose}
            loadData={loadData}
          />
        )}
      </>
    </React.Suspense>
  );
});

export default ImportFile;
