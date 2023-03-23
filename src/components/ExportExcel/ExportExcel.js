import React from "react";

import { FaFileExport } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import instance from "../../Interceptor";
import { getInventoryDateString } from "./../common/FileNameExcel/FileNameExcel";

const API_URL = instance.defaults.baseURL;

const ExportExcel = React.memo(
  ({ row, setIsLoading, flagOffline, endPoint }) => {
    if (flagOffline) {
      instance.defaults.headers.common["flagOffline"] = true;
    }
    const handleExport = async () => {
      console.log(row);
      try {
        if (typeof row === "undefined" || row.length === 0) {
          Swal.fire({
            icon: "error",
            text: "No have device to export",
          });
          return;
        }
        //const rowId = row.map((i) => i.id);

        const formData = new FormData();
        formData.append("row", JSON.stringify(row));
        setIsLoading(true);
        const response = await instance.post(`${API_URL}${endPoint}`, formData);

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", getInventoryDateString());
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
          size="sm"
          onClick={handleExport}
          style={{ marginLeft: "10px", borderRadius: "5px" }}
        >
          <FaFileExport />
        </Button>
      </div>
    );
  }
);

export default ExportExcel;
