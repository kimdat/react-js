import React, { useCallback, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { api } from "../../Interceptor";

const API_URL = api.defaults.baseURL;

const DeleteRow = React.memo(
  ({
    rowsId,
    data,
    setSearchApiData,
    setCheckedRows,
    loadData,
    setIsLoading,
  }) => {
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
          setIsLoading(true);
          await api.get(`${API_URL}deleteRow`, { params });
          const newData = data.filter(
            (row) => !arrId.includes(row.id) && !arrId.includes(row.ParentId)
          );
          if (newData.length === 0) {
            loadData();
          } else {
            setSearchApiData(newData);
          }
          setIsLoading(false);
          setCheckedRows([]);
          Swal.fire({
            icon: "success",
            text: "Delete success",
          });
        } catch (err) {
          setIsLoading(false);
          console.error(err);
          const message = err?.response?.data?.error ?? err?.error ?? err;
          Swal.fire({
            icon: "error",
            text: `Error  handDelete() in deleteRow.js ${message}`,
          });
        }
      }
    }, [
      rowsId,
      data,
      setSearchApiData,
      setCheckedRows,
      confirmDelete,
      loadData,
      setIsLoading,
    ]);

    return (
      <div>
        <Button
          variant="danger"
          onClick={handleDelete}
          style={{ marginLeft: "10px", borderRadius: "10px" }}
        >
          <FaTrash />
        </Button>
      </div>
    );
  }
);

export default DeleteRow;
