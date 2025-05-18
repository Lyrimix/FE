import "./UserOption.css";
import { useRef, useState, useEffect } from "react";
import { useFileUpload } from "../../../hooks/useFileUpload";
import { ExportOptions } from "../../export-option-mols/ExportOptions";
import { sizeOptions } from "../../../utils/constant";
import { FiUpload, FiSave } from "react-icons/fi";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { useSaveContext } from "../../../utils/context/SaveContext";
import { ExportForm } from "../../export-form-mols/ExportForm";
import { generateCloudinaryUrlForSingleVideo } from "../../../utils/cloudinaryUtils";
import { BACKGROUND_IMAGES } from "../../../utils/constant";
import { addBackgroundToSingleVideo } from "../../../apis/ProjectApi";
import { useNavigate } from "react-router-dom";

export const UserOption = () => {
  const navigate = useNavigate();
  const [isExport, setIsExport] = useState(false);
  const {
    setIsDemoCutting,
    setSelectedAddBackGroundVideoIndex,
    setProjectVideosId,
    projectVideosID,
    videosId,
  } = useProjectContext();
  const { uploadFiles } = useFileUpload();
  const fileInputRef = useRef(null);
  const { hasClickedSaveRef, prevEditorDataRef } = useSaveContext();

  const handleUploadClick = async () => {
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    setIsExport(!isExport);
  };

  const handleUpdateClick = () => {
    hasClickedSaveRef.current = true;
    setIsDemoCutting(false);
    prevEditorDataRef.current = {};
  };

  return (
    <div className="container p-0">
      <div className="user-option d-flex justify-content-center align-items-center p-3 ">
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
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          {/* <button
            className="user-option__btn d-flex align-items-center gap-2"
            onClick={handleUploadClick}
          >
            <FiUpload />
            Upload
          </button> */}
          {/* <button
            className="user-option__btn d-flex align-items-center gap-2"
            onClick={handleUpdateClick}
          >
            <FiSave />
            Save
          </button> */}
          <button
            className="user-option__btn d-flex align-items-center gap-2"
            onClick={handleExportClick}
          >
            <FiUpload />
            Export
          </button>
        </div>
      </div>
      {isExport && (
        <div className="export-form-container mt-3">
          <ExportForm isOpen={isExport} toggle={handleExportClick} />
        </div>
      )}
    </div>
  );
};
