import "./UserOption.css";
import { useRef, useState, useEffect } from "react";
import { FiUpload, FiSave } from "react-icons/fi";
import { ExportForm } from "../../export-form-mols/ExportForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../utils/context/UserContext";
import { UserAvatarAndName } from "../../user-avatar-name-mols/UserAvatarAndName";
import { UserOnboardingModal } from "../../../organisms/user_onboarding/UserOnboardingModal";

export const UserOption = () => {
  const navigate = useNavigate();
  const [isExport, setIsExport] = useState(false);
  const [isUserOnboardingOpen, setIsUserOnboardingOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleExportClick = () => {
    setIsExport(!isExport);
  };

  const handleOnClickUserInfo = () => {
    setIsUserOnboardingOpen(true);
  };

  const handleCloseOnboarding = () => {
    setIsUserOnboardingOpen(false);
  };

  const handleProjectSelected = (projectId) => {
    setSelectedProject({ id: projectId });
    localStorage.setItem(
      "selectedProjectId",
      JSON.stringify({ id: projectId })
    );
    handleCloseOnboarding();
  };

  const handleNewProjectCreated = () => {
    // ... các dòng khác giữ nguyên ...
    navigate("/homepage", { state: { createNewProject: true } }); // Truyền state qua navigate
    handleCloseOnboarding();
    console.log("handleNewProjectCreated");
};

  const { user } = useUser();

  return (
    <div className="container-user-option p-0">
      <div className="user-option">
        <div
          className="user-option__header--right d-flex gap-3"
          onClick={handleOnClickUserInfo}
        >
          <UserAvatarAndName />

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
      {isUserOnboardingOpen && (
        <div className="">
          <UserOnboardingModal
            show={isUserOnboardingOpen}
            onClose={handleCloseOnboarding}
            onProjectSelected={handleProjectSelected}
            onNewProjectCreated={handleNewProjectCreated}
          />
        </div>
      )}
    </div>
  );
};
