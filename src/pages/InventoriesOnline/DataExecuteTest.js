import React, { useState, forwardRef, useCallback } from "react";
import InventoriesComponentOnline from "./InventoriesComponentOnline";

import Swale from "sweetalert2";

const DataExecuteTest = forwardRef((props, ref) => {
  const [rowExpand, setRowExpand] = useState([]);
  //datapage hiện tại
  const [searchApiData, setSearchApiData] = useState([]);
  //tổng row
  const [totalRow, setTotalRow] = useState(0);
  //tổng data
  const [dataAll, setDataAll] = useState([]);
  const getExecute = async () => {
    try {
      const pust = [];
      for (let index = 0; index < 12; index++) {
        const data = {
          ip: "1" + Math.random(0, 100),
          id: "123" + Math.random(0, 100),
          Name: Math.random(0, 100),
          children: [],
        };
        pust.push(data);
      }
      const data = {};
      data.success = pust;
      data.fail = [];
      const dataSuccess = data.success;
      console.log(dataSuccess);
      const dataFail = data.fail;
      if (dataFail.length > 0) {
        const messFail = dataFail.map((i) => i.ip);
        Swale.fire({
          title: "ConnectFail",
          icon: "error",
          html: `Have ${
            messFail.length
          } ConnectFail.Ip connect fail:${messFail.join(",")}`,
        });
      }
      if (dataSuccess.length > 0) {
        setSearchApiData(dataSuccess.slice(0, 10));
        setRowExpand(dataSuccess.map((item) => item.id));
        setTotalRow(dataSuccess.length);
        setDataAll(dataSuccess);
      } else setSearchApiData([]);
    } catch (err) {
      setSearchApiData([]);
      const message = err?.response?.data?.error ?? err?.error ?? err;
      console.error(message);
    }
  };
  const handleClick = useCallback(async () => {
    getExecute();
  }, []);
  React.useImperativeHandle(ref, () => ({
    // Định nghĩa hàm handleClick() để có thể gọi từ cha
    handleClick,
  }));

  return (
    <>
      <button style={{ display: "none" }} onClick={handleClick}>
        Click me!
      </button>
      {searchApiData.length > 0 && (
        <InventoriesComponentOnline
          searchApiData={searchApiData}
          setSearchApiData={setSearchApiData}
          totalRow={totalRow}
          rowExpand={rowExpand}
          setRowExpand={setRowExpand}
          dataAll={dataAll}
        />
      )}
    </>
  );
});
export default DataExecuteTest;
