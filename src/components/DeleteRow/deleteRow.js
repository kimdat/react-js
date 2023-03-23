import React, { useCallback, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { api } from "../../Interceptor";

const API_URL = api.defaults.baseURL;

const DeleteRow = React.memo(({ rowsId, loadData }) => {
  const names = useMemo(() => {
    let STT = 0;
    return rowsId
      .filter((item) => typeof item.name != "undefined")
      .map((item) => ++STT + "." + item.name);
  }, [rowsId]);

  const confirmDelete = useCallback(async () => {
    console.log(rowsId);
    if (rowsId.length === 0 || typeof rowsId[0] == "undefined") {
      Swal.fire({
        icon: "error",
        text: "Please choose device to delete",
      });
      return;
    }
    const result = await Swal.fire({
      title: "confirmDelete!Are you sure delete devices!",
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
  }, [names, rowsId]);

  const handleDelete = useCallback(async () => {
    if (await confirmDelete()) {
      const arrId = rowsId.map((item) => item.id);
      const params = {
        rowsId: JSON.stringify(arrId),
      };
      try {
        // setIsLoading(true);
        await api.get(`${API_URL}deleteRow`, { params });
        loadData();
        Swal.fire({
          icon: "success",
          text: "Delete success",
        });
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.error ?? err?.error ?? err;
        Swal.fire({
          icon: "error",
          text: `Error  handDelete() in deleteRow.js ${message}`,
        });
      }
    }
  }, [confirmDelete, loadData, rowsId]);

  return (
    <div>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        style={{ marginLeft: "10px", borderRadius: "5px" }}
      >
        <FaTrash />
      </Button>
    </div>
  );
});

export default DeleteRow;
