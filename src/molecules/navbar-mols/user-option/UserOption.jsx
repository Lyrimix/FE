import "./UserOption.css";
import { FiUpload } from "react-icons/fi";
import { handleFileSelected } from "../../../utils/handleFileSelected";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { useRef, useEffect, useState } from "react";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { ExportForm } from "../../export-form-mols/ExportForm";

export const UserOption = () => {
  const { selectedFiles, setSelectedFiles, setPreviewUrls } = useVideoContext();
  const { projectInfo, setProjectInfo } = useProjectContext();
  const [isExport, setIsExport] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleExportClick = () => {
    setIsExport(!isExport);
  };

  useEffect(() => {
    console.log("Project Info:", projectInfo);
  }, [projectInfo]);
  return (
    <div className="user-option">
      <div className="user-option__header user-option__header--left"></div>
      <div className="user-option__header user-option__header--right">
        <input
          ref={fileInputRef}
          type="file"
          id="video-section__file-input"
          accept="video/*"
          multiple
          style={{ display: "none" }}
          onChange={(event) =>
            handleFileSelected(
              event,
              selectedFiles,
              setSelectedFiles,
              setPreviewUrls,
              projectInfo,
              setProjectInfo
            )
          }
        />
        <button className="user-option__btn" onClick={handleUploadClick}>
          <FiUpload className="user-option__btn-icon" />
          Upload
        </button>
        <button className="user-option__btn" onClick={handleExportClick}>
          <FiUpload className="user-option__btn-icon" />
          Export
        </button>

        <button
          className="user-option__authenticaion"
          onClick={handleUploadClick}
        >
          Sign In
        </button>
        <button className="user-option__authenticaion">Sign Up</button>
      </div>

      {isExport && (
        <div className="export-form-container">
          <ExportForm />
        </div>
      )}
    </div>
  );
};
