import React, { useEffect, useState } from "react";
import { Navbar } from "../../organisms/navbar/Navbar";
import { MainContent } from "../../organisms/main-content/MainContent";
import Sidebar from "../../organisms/sidebar/Sidebar";
import { UserOnboardingModal } from "../../organisms/user_onboarding/UserOnboardingModal"; // Import modal
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

export const HomePage = () => {
  const [showOnboardingModal, setShowOnboardingModal] = useState(true); // Ban đầu hiển thị modal
  const [selectedProject, setSelectedProject] = useState(null); // State để lưu dự án được chọn

  // --- useEffect để kiểm tra xem đã có dự án được chọn/lưu chưa ---
  // Bạn có thể lưu trạng thái này vào localStorage hoặc context
  // để người dùng không phải chọn lại mỗi khi load lại trang
  useEffect(() => {
    const savedSelectedProjectId = localStorage.getItem("selectedProjectId");
    if (savedSelectedProjectId) {
      setSelectedProject(JSON.parse(savedSelectedProjectId));
      setShowOnboardingModal(false); // Nếu đã có, không cần hiện modal
    } else {
      setShowOnboardingModal(true); // Nếu chưa, hiện modal
    }
  }, []);

  const handleProjectSelected = (projectId) => {
    // Ở đây, bạn có thể fetch chi tiết dự án nếu cần
    // Hiện tại, chúng ta chỉ lưu ID và đóng modal
    setSelectedProject({ id: projectId }); // Lưu ID dự án đã chọn
    localStorage.setItem(
      "selectedProjectId",
      JSON.stringify({ id: projectId })
    ); // Lưu vào localStorage để nhớ
    setShowOnboardingModal(false); // Đóng modal
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar className="w-100"></Navbar>
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar className="home-page__sidebar text-white"></Sidebar>
        <MainContent
          className="flex-grow-1 p-3 ms-5 overflow-auto"
          selectedProject={selectedProject}
        ></MainContent>
      </div>
      {/* Render Modal */}
      <UserOnboardingModal
        show={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)} // Có thể thêm logic kiểm tra trước khi đóng
        onProjectSelected={handleProjectSelected}
      />
    </div>
  );
};
