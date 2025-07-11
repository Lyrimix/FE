import React, { useEffect, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import {
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { ThumbnailPreview } from "../../atoms/medias/ThumbnailPreview";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { exportProject, updateProject } from "../../apis/ProjectApi";
import { useLoadingStore } from "../../store/useLoadingStore";
import "./ExportForm.css";
import { useVideoContext } from "../../utils/context/VideoContext";
import { uploadToCloudinary, getProjectById } from "../../apis/ProjectApi";
import { Spinner } from "react-bootstrap";
import { SubtitleFormatSelectionModal } from "../subtitle-format-selection-modal/SubtitleFormatSelectionModal";

export const ExportForm = ({ isOpen, toggle }) => {
  const { projectInfo, videoThumbnail } = useProjectContext();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const { projectVideo } = useVideoContext();
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
  const [showSubtitleFormatModal, setShowSubtitleFormatModal] = useState(false);
  const [isLyric, setIsLyric] = useState(false);
  const handleDownloadVideo = async () => {
    setIsDownloadingVideo(true);
    alert(`Download project video`);

    try {
      const cloudinaryUrl = await uploadToCloudinary(projectVideo);
      projectInfo.asset = cloudinaryUrl;
      updateProject(projectInfo);
      await exportProject(projectInfo.id, ".mov");
    } catch (error) {
      console.error("Error sending files to the server:", error);
      alert("Failed to download video. Please try again.");
    } finally {
      setIsDownloadingVideo(false); // End loading
    }
  };
  const handleDownloadSubtitle = () => {
    setShowSubtitleFormatModal(true); // Open the subtitle format selection modal
  };

  const handleCloseSubtitleFormatModal = () => {
    setShowSubtitleFormatModal(false); // Close the subtitle format selection modal
  };
  useEffect(() => {
    const fetchProjectData = async () => {
      if (isOpen) {
        try {
          const response = await getProjectById(projectInfo.id);
          console.log("response", response.data.result);
          if (response.data.result.lyric){
            setIsLyric(true) // Logic này cần được xem xét lại dựa trên cấu trúc response.data
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
          // Xử lý lỗi nếu cần, ví dụ: alert('Failed to load project data.');
        }
      }
    };

    fetchProjectData();
  }, [isOpen, projectInfo.id]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="md"
      centered
      scrollable
      className="custom-modal"
    >
      <ModalHeader toggle={toggle}>Export Project</ModalHeader>
      <ModalBody>
        {/* <h3 className="fs-6 mb-3">Cover image and video</h3> */}
        <div className="mb-3 d-flex justify-content-center">
          <div style={{ width: "200px" }}>
            <ThumbnailPreview
              src={videoThumbnail[0]?.thumbnailUrl}
              alt="Video thumbnail"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="button-section">
          <button
            onClick={handleDownloadVideo}
            className="download-button"
            disabled={isDownloadingVideo}
          >
            {isDownloadingVideo ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Downloading...
              </>
            ) : (
              <>
                <FiDownload className="icon" /> Download Project Video
              </>
            )}
          </button>
          {isLyric && (
            <button
              onClick={handleDownloadSubtitle}
              className="download-button"
            >
              <FiFileText className="icon" /> Download Subtitles
            </button>
          )}
        </div>
      </ModalFooter>
      <SubtitleFormatSelectionModal
        show={showSubtitleFormatModal}
        onClose={handleCloseSubtitleFormatModal}
        projectId={projectInfo.id}
        projectName={projectInfo.name}
      />
    </Modal>
  );
};
