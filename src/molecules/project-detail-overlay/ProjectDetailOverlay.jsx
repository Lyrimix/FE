import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap"; // Import Spinner
import { FiDownload, FiFileText } from "react-icons/fi";
import { SubtitleFormatSelectionModal } from "../subtitle-format-selection-modal/SubtitleFormatSelectionModal";
import { deleteProject, exportProject } from "../../apis/ProjectApi";

import "./ProjectDetailOverlay.scss";

export const ProjectDetailOverlay = ({
  show,
  onClose,
  project,
  onProjectDeleted,
}) => {
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
  const [showSubtitleFormatModal, setShowSubtitleFormatModal] = useState(false); // New state for subtitle modal

  if (!project) {
    return null;
  }

  const { name, asset, uploadTime, size, lyric } = project;
  const extractTextLines = (assText) => {
    if (typeof assText !== "string") return [];
    return assText
      .split(/\r?\n/)
      .filter((line) => line.startsWith("Dialogue:"))
      .map((line) => {
        const parts = line.split(",");
        return parts.slice(9).join(",").trim(); // Lấy phần text
      })
      .filter((text) => text); // Loại bỏ dòng trống
  };
  const lyricLines = lyric ? extractTextLines(lyric) : [];

  const handleDownloadVideo = async () => {
    setIsDownloadingVideo(true);
    alert(`Download project video: ${name}`);

    try {
      await exportProject(project.id, ".mov");
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
  // const handleDownloadSubtitle = () => {
  //   alert(`Download project subtitles: ${name} (choose format)`);
  //   // Thực tế: Mở một modal khác để người dùng chọn định dạng (SRT, VTT, TXT, v.v.)
  // };
  const handleDelete = async () => {
    alert(`Delete project: ${name}`);
    const token = localStorage.getItem("token");
    try {
      await deleteProject(project.id, token);
      onClose();
      if (onProjectDeleted) {
        onProjectDeleted();
      }
    } catch (error) {
      console.error("Delete project failed:", error);
      alert("Delete project failed");
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
        size="lg"
        className="project-detail-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{name || "Untitled project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="project-detail-modal__body">
          <div className="video-section">
            {asset ? (
              <video
                controls
                className="project-detail-modal__video"
                src={asset}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="no-video-placeholder">
                No video preview available
              </div>
            )}
          </div>

          <div className="project-info-section">
            <p>
              <strong>Creation date:</strong>{" "}
              {uploadTime
                ? new Date(uploadTime).toLocaleDateString("vi-VN")
                : "Unknown"}
            </p>
            {size && (
              <p>
                <strong>Size:</strong> {size}
              </p>
            )}
            {lyricLines.length > 0 && (
              <div className="lyric-preview mt-3">
                <strong>Lyric Preview:</strong>
                <ul className="mt-1 ps-3">
                  {lyricLines.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="button-section">
            <Button
              variant="primary"
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
            </Button>
            {lyric && (
              <Button
                variant="primary"
                onClick={handleDownloadSubtitle}
                className="download-button"
              >
                <FiFileText className="icon" /> Download Subtitles
              </Button>
            )}
            <Button
              variant="danger"
              onClick={handleDelete}
              className="delete-button"
            >
              <FiFileText className="icon" /> Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Subtitle Format Selection Modal */}
      <SubtitleFormatSelectionModal
        show={showSubtitleFormatModal}
        onClose={handleCloseSubtitleFormatModal}
        projectId={project.id}
        projectName={name}
      />
    </>
  );
};
