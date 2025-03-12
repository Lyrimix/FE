import "./UserOption.css";
import { FiUpload } from "react-icons/fi";
import { useRef, useState } from "react";
import { ExportForm } from "../../export-form-mols/ExportForm";
import { useFileUpload } from "../../../hooks/useFileUpload";

export const UserOption = () => {
  const [isExport, setIsExport] = useState(false);
  const { uploadFiles } = useFileUpload();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    setIsExport(!isExport);
  };

  return (
    <div className="container p-0">
      <div className="user-option d-flex justify-content-center align-items-center p-3 ">
        <div className="user-option__header user-option__header--left"></div>
        <div className="user-option__header--right d-flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            className="d-none"
            onChange={uploadFiles}
          />
          <button
            className="user-option__btn d-flex align-items-center gap-2"
            onClick={handleUploadClick}
          >
            <FiUpload />
            Upload
          </button>
          <button
            className="user-option__btn d-flex align-items-center gap-2"
            onClick={handleExportClick}
          >
            <FiUpload />
            Export
          </button>
          <button className="user-option__authenticaion">Sign In</button>
          <button className="user-option__authenticaion">Sign Up</button>
        </div>
      </div>
      {isExport && (
        <div className="export-form-container mt-3">
          <ExportForm />
        </div>
      )}
    </div>
  );
};
