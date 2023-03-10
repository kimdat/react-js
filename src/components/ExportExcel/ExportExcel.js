import React from "react";

import { FaFileExport } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import instance from "../../Interceptor";

const API_URL = instance.defaults.baseURL;

const ExportExcel = React.memo(({ row, setIsLoading, flagOffline }) => {
  if (flagOffline) {
    instance.defaults.headers.common["flagOffline"] = true;
  }
  const handleExport = async () => {
    try {
      if (row.length === 0 || typeof row[0] == "undefined") {
        Swal.fire({
          icon: "error",
          text: "Please choose device to delete",
        });
        return;
      }
      const rowId = row.map((i) => i.id);

      const formData = new FormData();
      formData.append("rowId", JSON.stringify(rowId));
      setIsLoading(true);
      const response = await instance.post(
        `${API_URL}exportFileExcel`,
        formData
      );
      console.log(response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `inventory${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Xóa liên kết sau khi tải xuống
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const reader = new FileReader();
      reader.onload = () => {
        const result = JSON.parse(reader.result);
        console.error(result.error);
        Swal.fire({
          icon: "error",
          text: result.error,
        });
      };
      reader.readAsText(error.response.data);
    }
  };

  return (
    <div>
      <Button
        variant="info"
        onClick={handleExport}
        style={{ marginLeft: "10px", borderRadius: "10px" }}
      >
        <FaFileExport />
      </Button>
    </div>
  );
});

export default ExportExcel;
