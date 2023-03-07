import React, { useCallback, useMemo, useState, useRef } from 'react';
import Swal from "sweetalert2";
import './FileUpload.css'

import FileList from "../FileList/FileList";

const setFileList = (fileList, files, setFiles) => {
    if (fileList.length === 0) return;
    const newFiles = [];
    const duplicateFiles = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        // Check if file with the same name already exists in the file list
        const isDuplicate = files.some(existingFile => existingFile.name === file.name);
        if (isDuplicate) {
            duplicateFiles.push(file.name);
            continue;
        }
        newFiles.push(file);
    }

    if (duplicateFiles.length > 0) {
        Swal.fire({
            icon: 'error',
            text: `The file "${duplicateFiles.join(', ')}" already exists in the list. Please choose a different file.`,
        });

    }
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
};

const FileUpload = ({ files, setFiles, removeFile }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragEnter = useCallback(event => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragOver = useCallback(event => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(event => {
        event.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(event => {
        event.preventDefault();
        setIsDragging(false);
        const fileList = event.dataTransfer.files;
        setFileList(fileList, files, setFiles);
        fileInputRef.current.value = null;
    }, [files, setFiles]);

    const handleUpload = useCallback(event => {
        const fileList = event.target.files;
        setFileList(fileList, files, setFiles);
        fileInputRef.current.value = null;
    }, [files, setFiles]);

    const memoizedFiles = useMemo(() => files, [files]);

    return (
        <div>
            <div
                className={`file-card ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="file-inputs">
                    <input type="file" ref={fileInputRef} multiple accept=".txt,.log" onChange={handleUpload} />
                    <button>Upload</button>
                </div>
                <p className="main">Supported files</p>
                <p className="info">
                    <span>log</span>
                    <span>,txt</span>
                </p>
            </div>
            {memoizedFiles.length > 0 ? <FileList files={memoizedFiles} removeFile={removeFile} /> : <div style={{ textAlign: "center" }}></div>}
        </div>
    );
};

export default FileUpload;
