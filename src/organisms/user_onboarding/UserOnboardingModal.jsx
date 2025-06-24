import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useUser } from "../../utils/context/UserContext";
import { getListProject, updatedUser } from "../../utils/project.js";
import { PersonalInfoModal } from "./PersonalInfoModal";
import { ProjectDetailOverlay } from "../../molecules/project-detail-overlay/ProjectDetailOverlay.jsx";
import { ToastContainer, toast } from "react-toastify";
import { useProjectContext } from "../../utils/context/ProjectContext.jsx";
import { useVideoContext } from "../../utils/context/VideoContext.jsx";
import { useSaveContext } from "../../utils/context/SaveContext.jsx";
import "./UserOnboardingModal.css";

export const UserOnboardingModal = ({
  show,
  onClose,
  onProjectSelected,
  onNewProjectCreated,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    avatar: "",
    fullname: "",
    phone: "",
    username: "",
    password: "",
  });
  const [projects, setProjects] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { user, setUser } = useUser();
  const videoRefs = useRef({});
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showProjectDetailOverlay, setShowProjectDetailOverlay] =
    useState(false);
  const [refreshProjects, setRefreshProjects] = useState(false); // New state to trigger refresh
  const { hasClickedSaveRef, prevEditorDataRef, resetSaveContext } =
    useSaveContext();
  const { resetVideoContext, fileInputRef } = useVideoContext();

  const { setEditorData, resetProjectContext } = useProjectContext();
  useEffect(() => {
    if (show) {
      setIsLoadingData(true);
      const loadInitialData = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await getListProject(token);
          console.log("getListProject has response: ", response);
          const projectList = response || [];
          setProjects(projectList);
        } else {
          setProjects([]);
        }

        if (user) {
          setPersonalInfo({
            email: user.email || "",
            avatar: user.userAvatarUrl || "",
            fullname: user.userFullname || "",
            phone: user.userPhoneNumber || "",
            username: user.username || "",
          });
        }
        setIsLoadingData(false);
      };
      loadInitialData();
    }
  }, [show, user, refreshProjects]);

  // --- Xử lý khi chọn dự án ---
  const handleProjectSelect = (project) => {
    // e.stopPropagation()
    console.log("handleProjectSelect: ", project);
    setSelectedProjectId(project);
    setShowProjectDetailOverlay(true);
  };
  const handleProjectDeleted = () => {
    setRefreshProjects((prev) => !prev);
  };

  const handleOnClickUserInfo = (e) => {
    e.stopPropagation();
    setShowPersonalInfoModal(true);
  };
  // --- Xử lý khi lưu thông tin cá nhân từ PersonalInfoModal ---
  const handleSavePersonalInfo = async (updatedInfo) => {
    console.log("Updated personal info:", updatedInfo);
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Storing personal information...");
    if (!token) {
      toast.update(toastId, {
        render: "Your session has expired. Please log in again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }
    try {
      const response = await updatedUser(token, updatedInfo);

      setPersonalInfo({
        email: response.email || updatedInfo.email || "",
        avatar: response.userAvataUrl || updatedInfo.avatar || "",
        fullname: response.userFullname || updatedInfo.fullname || "",
        phone: response.userPhoneNumber || updatedInfo.phone || "",
        username: response.username || updatedInfo.username || "",
      });

      if (setUser) {
        setUser((prevUser) => ({
          ...prevUser,
          email: response.email || updatedInfo.email,
          userAvatarUrl: response.userAvataUrl || updatedInfo.avatar,
          userFullname: response.userFullname || updatedInfo.fullname,
          userPhoneNumber: response.userPhoneNumber || updatedInfo.phone,
          username: response.username || updatedInfo.username,
        }));
      }

      toast.update(toastId, {
        render: "Information updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating information.";
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  // --- Hàm xử lý khi chuột di vào video ---
  const handleVideoMouseEnter = (projectId) => {
    const videoElement = videoRefs.current[projectId];
    if (videoElement) {
      videoElement.muted = true;
      videoElement.play().catch((error) => {
        console.warn("Autoplay was prevented:", error);
      });
    }
  };

  // --- Hàm xử lý khi chuột di ra khỏi video ---
  const handleVideoMouseLeave = (projectId) => {
    const videoElement = videoRefs.current[projectId];
    if (videoElement) {
      videoElement.pause(); // Dừng video
      videoElement.currentTime = 0; // Tua về đầu (tùy chọn)
    }
  };

  // -- Hàm xử lí khi click tạo dự án mới --
  const handleCreateProject = () => {
    if (onNewProjectCreated) {
      onNewProjectCreated();
      resetProjectContext();
      resetVideoContext();
      resetSaveContext();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    onClose();
  };

  return (
    <>
      <Modal
        show={show}
        keyboard={false} // Chặn đóng modal bằng phím ESC
        centered // Căn giữa màn hình
        className="user-onboarding-modal" // Thêm class để tùy chỉnh CSS
      >
        <Modal.Header>
          <Modal.Title>Welcome to Lyrimix</Modal.Title>

          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          {isLoadingData ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading your project list...</p>
            </div>
          ) : (
            <>
              <div className="d-grid gap-2">
                {" "}
                <Button className="btn-info" onClick={handleOnClickUserInfo}>
                  Personal information
                </Button>
                <Button
                  className="btn-2"
                  onClick={() => {
                    if (
                      window.confirm("Bạn có chắc chắn muốn đăng xuất không?")
                    ) {
                      window.location.href =
                        "https://beamish-bonbon-e6f485.netlify.app/";
                    }
                  }}
                >
                  Log out
                </Button>
              </div>
              <h5 className="mt-4">Your project:</h5>
              <div className="project-grid">
                <div className="project-item create-project-item flex flex-col justify-center items-center">
                  <Button
                    onClick={handleCreateProject}
                    className=" flex flex-col justify-center items-center text-lg font-semibold  duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-blue-500" // nhỏ lại
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create a new project
                  </Button>
                </div>
                {projects.map((project) => (
                  <div
                    className="project-item flex flex-col justify-center items-center"
                    key={project.id}
                    onClick={() => handleProjectSelect(project)}
                    onMouseEnter={() => handleVideoMouseEnter(project.id)}
                    onMouseLeave={() => handleVideoMouseLeave(project.id)}
                  >
                    {project.asset ? (
                      <video
                        ref={(el) => (videoRefs.current[project.id] = el)}
                        src={project.asset}
                        className="project-video"
                        // onClick={handleOnClickVideo}
                        muted
                        loop
                      >
                        <source src={project.asset} type="video/mp4" />
                        Your browser does not support video.
                      </video>
                    ) : (
                      <img
                        src="https://placehold.co/300x150/cccccc/333333?text=no+video"
                        alt="Không có video"
                        className="project-video w-full h-40 object-cover rounded-t-lg"
                      />
                    )}
                    <span>{project.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      <PersonalInfoModal
        show={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        personalInfo={personalInfo}
        onSave={handleSavePersonalInfo}
      />
      <ProjectDetailOverlay
        show={showProjectDetailOverlay}
        onClose={() => setShowProjectDetailOverlay(false)}
        project={selectedProjectId}
        onProjectDeleted={handleProjectDeleted}
      />
    </>
  );
};
