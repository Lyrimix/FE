import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useUser } from "../../utils/context/UserContext";
import { getListProject } from "../../utils/project.js";
import "./UserOnboardingModal.css";

export const UserOnboardingModal = ({ show, onClose, onProjectSelected }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
  });
  const [projects, setProjects] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { user } = useUser();
  const videoRefs = useRef({});
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
            name: user.name || "",
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

  const handleConfirm = () => {
    // Xử lý khi người dùng xác nhận
  };
  // --- Hàm xử lý khi chuột di vào video ---
  const handleVideoMouseEnter = (projectId) => {
    const videoElement = videoRefs.current[projectId];
    if (videoElement) {
      videoElement.muted = true; // Tắt tiếng
      videoElement.play().catch((error) => {
        // Xử lý lỗi nếu video không thể tự động phát (ví dụ: trình duyệt chặn autoplay)
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
    onClose();
  };
  return (
    <Modal
      show={show}
      backdrop="static" // Chặn click ra ngoài modal
      keyboard={false} // Chặn đóng modal bằng phím ESC
      centered // Căn giữa màn hình
      className="user-onboarding-modal" // Thêm class để tùy chỉnh CSS
    >
      <Modal.Header>
        <Modal.Title>Welcome to Lyrimix</Modal.Title>
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
              <Button
                variant="outline-info"
                onClick={() =>
                  alert(
                    `Tên: ${user?.name || "Chưa có"}\nEmail: ${
                      user?.email || "Chưa có"
                    }`
                  )
                }
                // Có thể thay thế alert bằng việc mở một modal/form chi tiết hơn
              >
                Personal information
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => alert("Chức năng này sẽ được thêm sau!")} // Thay thế bằng logic của bạn
              >
                Nút chức năng tùy chỉnh
              </Button>
            </div>
            <h5 className="mt-4">Your project:</h5>

            <div className="project-grid">
              <div className="project-item create-project-item flex flex-col justify-center items-center">
                <Button
                  onClick={handleCreateProject}
                  className=" flex flex-col justify-center items-center text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  style={{
                    minHeight: "150px",
                    backgroundColor: "#e0f2fe",
                    borderColor: "#90caf9",
                    borderRadius: "8px",
                  }}
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
                      src="https://res.cloudinary.com/ds7sx6zop/video/upload/so_0,eo_102/Demo3_dtpxsq.mp4"
                      className="project-video"
                      onClick={(e) => e.stopPropagation()}
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
      <Modal.Footer>
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={!selectedProjectId && projects.length > 0} // Chỉ cho phép confirm nếu đã chọn dự án (nếu có dự án)
        >
          Tiếp tục vào dự án đã chọn
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
