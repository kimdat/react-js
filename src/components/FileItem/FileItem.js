
import React, { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons'

import './FileItem.css'
const FileItem = React.memo(({ file, deleteFile }) => {
    const deleteFileHandler = useCallback(() => {
        deleteFile(file.name);
    }, [deleteFile, file.name]);

    return (

        <div
            className="file-item"  >
            <FontAwesomeIcon icon={faFileAlt} />
            <p>{file.name}</p>
            <div className="actions">
                <div className="loading"></div>
                <FontAwesomeIcon icon={faTrash}
                    onClick={deleteFileHandler} />

            </div>
        </div>

    )
});

export default FileItem