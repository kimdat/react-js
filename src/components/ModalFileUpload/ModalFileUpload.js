import React, { useState, useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Swale from "sweetalert2";

import { FaPlus } from "react-icons/fa";

import { api } from "../../Interceptor";

export const ModalFileUpload = ({ setIsLoading, loadData }) => {
  const API_URL = api.defaults.baseURL;
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState([]);

  const [importComponent, setImportComponent] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeFile = useCallback(
    (filename) => {
      setFiles((files) => files.filter((file) => file.name !== filename));
    },
    [setFiles]
  );

  const parseCsvFile = useCallback(async (data) => {
    // Tách chuỗi thành các dòng và loại bỏ các ký tự thừa
    try {
      const deviceNameRegexTest =
        /([\w-]+)#(admin\s+)?sh(o|ow)?\s+(invent\w*|inv(e|en))\w+/g;
      const isMatched = deviceNameRegexTest.test(data);
      if (!isMatched) {
        return { Error: "Incorrect format" };
      }
      const lines = data.split(/\r?\n/).filter((line) => line.trim() !== "");
      //const lines = data.split("\n");
      const deviceNameRegex =
        /([\w-]+)#(admin\s+)?sh(o|ow)?\s+(invent\w*|inv(e|en))$/g;
      const deviceDatas = [];
      const deviceNames = [];

      let jsonData = {};
      //split bỏ qua dòng trống
      let deviceData = [];

      for (let lineIndex = 0; lineIndex < lines.length; ) {
        const line = lines[lineIndex].trim();
        const match = line.match(deviceNameRegex);
        if (match) {
          const deviceName = match[0].split("#")[0];
          if (!deviceNames.includes(deviceName)) {
            deviceNames.push(deviceName);
            lineIndex += 2;
            while (
              lineIndex < lines.length - 1 &&
              lines[lineIndex].startsWith("NAME")
            ) {
              const [_, name, descr] = lines[lineIndex].match(
                /NAME: "(.*?)".*DESCR: "(.*?)"/
              );
              const [__, pid, vid, sn] = lines[lineIndex + 1].match(
                /PID: (.*?),.*VID: (.*?),.*SN:(.*)/
              );
              deviceData.push({
                NAME: name.trim(),
                DESCR: descr.trim(),
                PID: pid.trim(),
                VID: vid.trim(),
                SN: sn.trim(),
              });
              lineIndex += 2;
            }
            lineIndex--;
            if (deviceData.length > 0) {
              deviceDatas.push(deviceData);
              deviceData = [];
            } else {
              deviceNames.pop();
            }
          }
        }
        lineIndex++;
      }
      jsonData.Error = deviceNames.length === 0 ? "Incorrect format" : null;
      jsonData.deviceNames = jsonData.Error == null ? deviceNames : null;
      jsonData.deviceDatas = jsonData.Error == null ? deviceDatas : null;
      return jsonData;
    } catch (error) {
      return { Error: `Incorrect format` };
    }
  }, []);
  const readFileUpload = useCallback(
    async (file) => {
      return new Promise((resolve, reject) => {
        const render = new FileReader();
        render.readAsText(file);
        render.onload = async () => {
          const data = render.result;
          const jsonDevice = await parseCsvFile(data);
          jsonDevice.Error
            ? reject(`${file.name} ${jsonDevice.Error}`)
            : resolve(jsonDevice);
        };
        render.onerror = () => {
          reject(new Error(`Error reading file: ${file.name}`));
        };
      });
    },
    [parseCsvFile]
  );
  const findDuplicateFilesIndexes = useCallback((fileUploadContents) => {
    const deviceFileMap = {};
    const duplicateIndexes = new Set();
    for (const [index, file] of fileUploadContents.entries()) {
      for (const device of file.deviceNames) {
        if (deviceFileMap[device]) {
          deviceFileMap[device].push(index);
          const indexes = deviceFileMap[device];
          for (const idx of indexes) {
            duplicateIndexes.add(idx);
          }
          duplicateIndexes.add(index);
        } else {
          deviceFileMap[device] = [index];
        }
      }
    }
    // Group keys with same value
    const valueKeyMap = {};
    for (const device in deviceFileMap) {
      if (deviceFileMap[device].length > 1) {
        const value = JSON.stringify(deviceFileMap[device]);
        if (valueKeyMap[value]) {
          valueKeyMap[value].push(device);
        } else {
          valueKeyMap[value] = [device];
        }
      }
    }
    return { indexes: [...duplicateIndexes], valueMap: valueKeyMap };
  }, []);
  const confirmSwale = useCallback(
    async (htmlText, title) => {
      setIsLoading(false);
      const result = await Swale.fire({
        title: title,
        icon: "error",
        html:
          '<div style="max-height:300px;overflow-y:auto"><div>' +
          htmlText +
          "</div></div>",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      return result.isConfirmed;
    },
    [setIsLoading]
  );
  const removeIndexes = useCallback(async (data, indexes, files) => {
    const filteredData = data.filter((_, index) => !indexes.includes(index));
    const filteredFiles = files.filter((_, index) => !indexes.includes(index));
    return {
      filesToImport: filteredFiles,
      filesDataNameToImport: filteredData,
    };
  }, []);

  const insertDataUpload = useCallback(
    async (
      fileUploadContents,
      updateDuplicateDevices,
      pathArray,
      arrIndexesSuccess
    ) => {
      const formData = new FormData();

      const newUpdateDuplicateDevice = updateDuplicateDevices.reduce(
        (acc, item) => {
          acc[item.index] = item.duplicateNames;
          return acc;
        },
        {}
      );
      formData.append("fileUploadContents", JSON.stringify(fileUploadContents));
      if (updateDuplicateDevices.length > 0) {
        formData.append(
          "duplicateDevicesName",
          JSON.stringify(newUpdateDuplicateDevice)
        );
      }
      formData.append("pathArray", JSON.stringify(pathArray));
      formData.append("arrIndexesSuccess", JSON.stringify(arrIndexesSuccess));

      try {
        const { data } = await api.post(`${API_URL}insertDataUpload`, formData);
        console.log(data);
        if (data.Error) {
          const dataErr = data.Error;
          const fileNames = dataErr.map((err) => {
            const index = parseInt(err.FileErrorIndex);
            const file = files[index];
            return file.name;
          });
          const errorText = `Error when upload files: ${fileNames.join(", ")}`;

          Swale.fire({
            icon: "error",
            text: `${errorText}`,
          });
          return false;
        }
        return true;
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.error ?? err?.error ?? err;
        Swale.fire({
          icon: "error",
          text: `Error insertDataUpload ${message}`,
        });
        setIsLoading(false);
        return false;
      }
    },
    [API_URL, files, setIsLoading]
  );
  const MAX_FILES_PER_REQUEST = 20;
  const uploadFile = useCallback(
    async (fileUploadContents, filesParam, updateDuplicateDevices = []) => {
      if (fileUploadContents.length < 1) {
        setFiles([]);
        handleClose();
        return;
      }
      setIsLoading(true);
      try {
        const formData = new FormData(); // Tạo ra một instance mới của FormData
        const numRequests = Math.ceil(
          filesParam.length / MAX_FILES_PER_REQUEST
        );
        const responseArray = [];
        for (let i = 0; i < numRequests; i++) {
          formData.delete("files[]"); // Xóa giá trị của "files[]" trước đó trong FormData
          const start = i * MAX_FILES_PER_REQUEST;
          const end = start + MAX_FILES_PER_REQUEST;
          for (let j = start; j < end && j < filesParam.length; j++) {
            formData.append("files[]", filesParam[j]);
          }
          const response = await api.post(`${API_URL}fileupload`, formData);
          responseArray.push({ index: i, data: response.data });
        }
        //những file upload thành công
        let arrIndexesSuccess = [];
        const pathArray = responseArray
          .map((response, index) => {
            const data = response.data;
            const indexesSuccces = data
              .map((item) => index * MAX_FILES_PER_REQUEST + item.indexSuccess)
              .filter((item) => !isNaN(item));
            arrIndexesSuccess = arrIndexesSuccess.concat(indexesSuccces);
            return data;
          })
          .flat();

        const flagInsertData = await insertDataUpload(
          fileUploadContents,
          updateDuplicateDevices,
          pathArray,
          arrIndexesSuccess
        );
        //nếu insert false thì return
        if (!flagInsertData) return;
        setFiles([]);
        Swale.fire({
          icon: "success",
          text: "import success",
        });
        handleClose(true);
        loadData();
        setIsLoading(false);
        return;
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.error ?? err?.error ?? err;
        Swale.fire({
          icon: "error",
          text: `Error file upload ${message}`,
        });
        setIsLoading(false);
        return;
      }
    },
    [loadData, API_URL, insertDataUpload, setIsLoading]
  );
  const doImport = useCallback(
    async (fileUploadContents, filesParam) => {
      if (fileUploadContents.length < 1) {
        return;
      }
      const formData = new FormData();
      formData.append(
        "fileUploadContents",
        JSON.stringify(fileUploadContents.map((i) => i.deviceNames))
      );
      try {
        const { data } = await api.post(`${API_URL}getDataTrung`, formData);
        //Duplicate
        const duplicateDevices = data.duplicateDevices;
        if (duplicateDevices.length > 0) {
          let nameDuplicate = [];
          const swalMessages = duplicateDevices.map((item) => {
            const { index, duplicateNames } = item;
            nameDuplicate = nameDuplicate.concat(duplicateNames);
            return `"${
              filesParam[index].name
            }" contains existing devices: ${duplicateNames.join(",")}`;
          });

          const swalTitle =
            filesParam.length === 1
              ? "Existing Device!"
              : "Update Existing Device!";
          const swalConfirmText =
            filesParam.length === 1
              ? "Do you want to update them?"
              : "Do you want to update the existing files?";
          const result = await confirmSwale(
            swalMessages.join("<br/>"),
            swalTitle,
            swalConfirmText
          );
          if (result) {
            await uploadFile(fileUploadContents, filesParam, duplicateDevices);
          } else {
            //update những file không trùng
            const indexes = duplicateDevices.map((item) => item.index);
            const dataRemoveIndexes = await removeIndexes(
              fileUploadContents,
              indexes,
              filesParam
            );
            await uploadFile(
              dataRemoveIndexes.filesDataNameToImport,
              dataRemoveIndexes.filesToImport
            );
          }
          return;
        } else {
          await uploadFile(fileUploadContents, filesParam);
        }
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.error ?? err?.error ?? err;
        Swale.fire({
          icon: "error",
          text: `Error check file duplicate ${message}`,
        });

        return;
      }
    },
    [confirmSwale, removeIndexes, API_URL, uploadFile]
  );

  const importFile = useCallback(async () => {
    if (files.length === 0) {
      Swale.fire({
        icon: "error",
        text: "please choose one file to import",
      });
      return;
    }
    setIsLoading(true);
    // Check file extensions and size
    const isAllFilesValid = files.every((file) => {
      const isValidExtension = [".txt", ".log"].includes(
        file.name.slice(file.name.lastIndexOf("."))
      );
      const isValidSize = file.size < 20 * 1024 * 1024; // 20MB
      return isValidExtension && isValidSize;
    });
    if (!isAllFilesValid) {
      Swale.fire({
        icon: "error",
        text: "You have choosen fize size >=20MB or file not allowed.Only accep txt,log",
      });
      return;
    }
    try {
      /*const results = await Promise.allSettled(files.map(file => readFileUpload(file)));
                const filesDataNameToImport = results.map((result, index) => {
                if (result.status === 'fulfilled') {
                return { data: result.value, file: files[index] };
                } else {
                return { error: result.reason, file: files[index] };
                }
                });*/
      const filesDataNameToImport = await Promise.all(
        files.map((file, index) => {
          return readFileUpload(file)
            .then((data) => ({ data, file, index }))
            .catch((error) => ({ error, file, index }));
        })
      );
      const rejected = filesDataNameToImport.filter((file) => file.error);
      const accepted = filesDataNameToImport.filter((file) => !file.error);
      let filesParam = accepted.map((file) => file.file);
      let filesDataNameToImportParam = accepted.map((file) => file.data);

      //Nếu có file lỗi
      if (rejected.length > 0) {
        const reasons = rejected.map(({ error }) => `${error}<br/>`).join("");
        const rejectedIndexes = rejected.map(({ index }) => index);
        const result = await confirmSwale(
          `${reasons}Do you want to import the rest of the files?`,
          "Some files could not be read or have incorrect format"
        );
        if (!result) {
          setIsLoading(false);
          return;
        }
        const dataRemoveIndexes = await removeIndexes(
          filesDataNameToImportParam,
          rejectedIndexes,
          filesParam
        );
        filesDataNameToImportParam = dataRemoveIndexes.filesDataNameToImport;
        filesParam = dataRemoveIndexes.filesToImport;
      }
      //tìm file duplicate
      const { indexes, valueMap } = findDuplicateFilesIndexes(
        filesDataNameToImportParam
      );
      if (indexes.length > 0) {
        const messageLines = [];
        for (const [key, value] of Object.entries(valueMap)) {
          const fileIndexes = JSON.parse(key);
          // eslint-disable-next-line no-loop-func
          const fileNames = fileIndexes.map((i) => filesParam[i].name);
          const duplicateDevices = value.join(", ");
          const line = `${fileNames.join(", ")} have ${
            value.length
          } duplicate: ${duplicateDevices}`;
          messageLines.push(line);
        }
        const message = messageLines.join("<br/>");
        const result = await confirmSwale(
          `${message}. Do you want to import the rest of the files?`,
          "Some files are duplicates"
        );
        if (!result) {
          setIsLoading(false);
          return;
        }
        const dataRemoveIndexes = await removeIndexes(
          filesDataNameToImportParam,
          indexes,
          filesParam
        );
        filesDataNameToImportParam = dataRemoveIndexes.filesDataNameToImport;
        filesParam = dataRemoveIndexes.filesToImport;
      }
      if (filesDataNameToImportParam.length > 0)
        await doImport(filesDataNameToImportParam, filesParam);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [
    files,
    readFileUpload,
    findDuplicateFilesIndexes,
    confirmSwale,
    removeIndexes,
    doImport,
    setIsLoading,
  ]);

  useMemo(() => {
    import("../FileUpload/FileUpload.js").then((module) => {
      const FileUpload = module.default;
      setImportComponent(
        <FileUpload files={files} setFiles={setFiles} removeFile={removeFile} />
      );
    });
  }, [files, setFiles, removeFile]);

  return (
    <div>
      <Button
        variant="primary"
        style={{ borderRadius: "10px" }}
        onClick={handleShow}
      >
        <div>
          <FaPlus />
        </div>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Import file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {show && (
            <React.Suspense fallback={<div>Loading...</div>}>
              {importComponent}
            </React.Suspense>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={importFile}>
            Import
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ModalFileUpload;
