import React, { useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { api } from "../../../../../../Interceptor";

const API_URL = api.defaults.baseURL;

const UpdateInventories = React.memo((props) => {
  const { children, data, setIsLoading } = props;
  const confirmUpdate = useCallback(async () => {
    console.log(data);
    const names = data.map((item) => item.Name);
    const result = await Swal.fire({
      title: "confirmUpdate!Are you sure update  inventories for devices?",
      icon: "error",
      html: `<div style="max-height:300px;overflow-y:auto"><div >${names.join(
        "<br/>"
      )}</div></div>`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    return result.isConfirmed;
  }, [data]);

  const handleUpdate = useCallback(async () => {
    if (await confirmUpdate()) {
      const formData = new FormData();
      formData.append("child", JSON.stringify(children));
      formData.append("idParents", JSON.stringify(data.map((item) => item.id)));
      formData.append("action", "update");

      try {
        setIsLoading(true);
        await api.post(`${API_URL}updateInventories`, formData);

        Swal.fire({
          icon: "success",
          text: "Update success",
        });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
        const message = err?.response?.data?.error ?? err?.error ?? err;
        Swal.fire({
          icon: "error",
          text: `Error  handUpdate() in Updateinventories.js ${message}`,
        });
      }
    }
  }, [confirmUpdate, children, setIsLoading, data]);

  return (
    <div>
      <Button
        variant="warning"
        size="sm"
        onClick={handleUpdate}
        style={{ marginLeft: "10px", borderRadius: "5px" }}
      >
        <FaEdit /> UPDATE
      </Button>
    </div>
  );
});

export default UpdateInventories;
