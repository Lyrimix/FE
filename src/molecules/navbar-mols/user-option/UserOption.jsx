import "./UserOption.css";
import { useRef, useState, useEffect } from "react";
import { useFileUpload } from "../../../hooks/useFileUpload";
import { ExportOptions } from "../../export-option-mols/ExportOptions";
import { FiUpload, FiSave } from "react-icons/fi";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { useSaveContext } from "../../../utils/context/SaveContext";
import { ExportForm } from "../../export-form-mols/ExportForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../utils/context/UserContext";
import { UserAvatarAndName } from "../../user-avatar-name-mols/UserAvatarAndName";

export const UserOption = () => {
  const navigate = useNavigate();
  const [isExport, setIsExport] = useState(false);

  const handleExportClick = () => {
    setIsExport(!isExport);
  };

  const { user } = useUser();
  console.log("Current user from context:", user);

  return (
    <div className="container-user-option p-0">
      <div className="user-option d-flex justify-content-center align-items-center p-3 ">
        <div className="user-option__header--right d-flex gap-3">
          
            <UserAvatarAndName
              avatarUrl={user.userAvataUrl}
              displayName={user.userFullname}
            />
          
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
