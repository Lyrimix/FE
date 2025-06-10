import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useUser } from "../../utils/context/UserContext";
import { getListProject, updatedUser } from "../../utils/project.js";
import { PersonalInfoModal } from "./PersonalInfoModal";

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

  // --- useEffect để tải thông tin người dùng và dự án khi modal hiện lên ---
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
            // password: user.password || "",
          });
        }
        setIsLoadingData(false);
      };
      loadInitialData();
    }
  }, [show, user]);

  // --- Xử lý khi chọn dự án ---
  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    console.log("Selected project ID:", projectId); // in ra projectId
    onProjectSelected(projectId);
  };

  const handleOnClickUserInfo = (e) => {
    e.stopPropagation();
    setShowPersonalInfoModal(true);
  };
  // --- Xử lý khi lưu thông tin cá nhân từ PersonalInfoModal ---
  const handleSavePersonalInfo = async (updatedInfo) => {
    console.log("Updated personal info:", updatedInfo);
    const token = localStorage.getItem("token");
    if (!token) {
      alert(
        "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."
      );
      return;
    }
    const response = await updatedUser(token, updatedInfo);
    setPersonalInfo({
      email: response.email || updatedInfo.email || "",
      avatar: response.userAvataUrl || updatedInfo.avatar || "",
      fullname: response.userFullname || updatedInfo.fullname || "",
      phone: response.userPhoneNumber || updatedInfo.phone || "",
      username: response.username || updatedInfo.username || "",
    });

    // 2. Cập nhật thông tin người dùng trong UserContext
    if (setUser) {
      // Chỉ gọi setUser nếu nó tồn tại
      setUser((prevUser) => ({
        ...prevUser,
        email: response.email || updatedInfo.email,
        userAvatarUrl: response.userAvatarUrl || updatedInfo.avatar,
        userFullname: response.userFullname || updatedInfo.fullname,
        userPhoneNumber: response.userPhoneNumber || updatedInfo.phone,
        username: response.username || updatedInfo.username,
        // Không cập nhật password vào context
      }));
    }
    setPersonalInfo(updatedInfo);
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

  const handleOnClickVideo = (project) =>{
    project.stopPropagation()
  }

  // -- Hàm xử lí khi click tạo dự án mới --
  const handleCreateProject = () => {
    if (onNewProjectCreated) {
      onNewProjectCreated();
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
                      window.location.href = "http://localhost:5173/";
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
                    onClick={() => handleProjectSelect(project.id)}
                    onMouseEnter={() => handleVideoMouseEnter(project.id)}
                    onMouseLeave={() => handleVideoMouseLeave(project.id)}
                  >
                    {project.asset ? (
                      <video
                        ref={(el) => (videoRefs.current[project.id] = el)}
                        src={project.asset}
                        className="project-video"
                        onClick={handleOnClickVideo}
                        muted
                        loop
                      >
                        {/* Sử dụng thẻ <source> để chỉ định rõ loại video */}
                        <source src={project.asset} type="video/mp4" />
                        Your browser does not support video.
                      </video>
                    ) : (
                      <img
                        src="https://placehold.co/300x150/cccccc/333333?text=no+videos"
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
        {/* <Modal.Footer>
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={!selectedProjectId && projects.length > 0} // Chỉ cho phép confirm nếu đã chọn dự án (nếu có dự án)
        >
          Tiếp tục vào dự án đã chọn
        </Button>
      </Modal.Footer> */}
      </Modal>
      {/* Personal Info Modal */}
      <PersonalInfoModal
        show={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        personalInfo={personalInfo}
        onSave={handleSavePersonalInfo}
      />
    </>
  );
};
