import React, { useMemo, useCallback } from "react";
import FileItem from "./../FileItem/FileItem";

const FileList = React.memo(({ files, removeFile }) => {
  const deleteFileHandler = useCallback(
    (name) => {
      removeFile(name);
    },
    [removeFile]
  );
  const fileItems = useMemo(() => {
    return files.map((file) => (
      <FileItem key={file.name} file={file} deleteFile={deleteFileHandler} />
    ));
  }, [files, deleteFileHandler]);
  return (
    <div
      className="file-list"
      style={{ maxHeight: "250px", overflowY: "auto" }}
    >
      {" "}
      {fileItems}
    </div>
  );
});

export default FileList;
