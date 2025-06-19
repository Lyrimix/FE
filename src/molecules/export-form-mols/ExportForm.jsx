import React, { useState } from "react";
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
import { exportOptions } from "../../utils/constant";
import { useLoadingStore } from "../../store/useLoadingStore";
import "./ExportForm.css";
import UploadButton from "../export-youtube-option-mols/UploadButton";
import { useVideoContext } from "../../utils/context/VideoContext";
import { uploadToCloudinary } from "../../apis/ProjectApi";
import { Spinner } from "react-bootstrap";
import { SubtitleFormatSelectionModal } from "../subtitle-format-selection-modal/SubtitleFormatSelectionModal";

export const ExportForm = ({ isOpen, toggle }) => {
  const { projectInfo, videoThumbnail } = useProjectContext();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const { projectVideo } = useVideoContext();
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
  const [showSubtitleFormatModal, setShowSubtitleFormatModal] = useState(false);
  // const handleExportProject = async () => {
  //   try {
  //     setIsLoading(true);
  //     const cloudinaryUrl = await uploadToCloudinary(projectVideo);
  //     projectInfo.asset = cloudinaryUrl;
  //     updateProject(projectInfo);
  //     await exportProject(projectInfo.id, ".mov");
  //   } catch (error) {
  //     console.error("Error sending files to the server:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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
        {/* <Button
          className="bg-custom-primary text-dark"
          onClick={handleExportProject}
        >
          Export
        </Button> */}
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
          {/* {lyric && (
            <Button
              variant="primary"
              onClick={handleDownloadSubtitle}
              className="download-button"
            >
              <FiFileText className="icon" /> Download Subtitles
            </Button>
          )} */}
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
