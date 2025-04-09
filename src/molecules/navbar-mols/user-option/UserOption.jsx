import "./UserOption.css";
import { useRef, useState } from "react";
import { ExportForm } from "../../export-form-mols/ExportForm";
import { useFileUpload } from "../../../hooks/useFileUpload";
import { ExportOptions } from "../../export-option-mols/ExportOptions";
import { sizeOptions } from "../../../utils/constant";
import { FiUpload, FiSave } from "react-icons/fi";
import { updateProject } from "../../../apis/ProjectApi";
import UploadButton from "../../export-youtube-option-mols/UploadButton";
import { useProjectContext } from "../../../utils/context/ProjectContext";

export const UserOption = () => {
  const [isExport, setIsExport] = useState(false);
  const { uploadFiles } = useFileUpload();
  const fileInputRef = useRef(null);
  const { projectInfo } = useProjectContext();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    setIsExport(!isExport);
  };
  const handleUpdateClick = () => {
    updateProject(projectInfo)
      .then(() => console.log("Project updated successfully"))
      .catch((error) => console.error("Error updating project:", error));
  };

  return (
    <div className="container p-0">
      <div className="user-option d-flex justify-content-center align-items-center p-3 ">
        <div className="user-option__header user-option__header--left  d-flex align-items-center justify-content-center">
          <ExportOptions options={sizeOptions}></ExportOptions>
        </div>
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
            onClick={handleUpdateClick}
          >
            <FiSave />
            Save
          </button>
          <button
            className="user-option__btn d-flex align-items-center gap-2"
            onClick={handleExportClick}
          >
            <FiUpload />
            Export
          </button>
          <UploadButton />
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
