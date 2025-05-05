import React, { useState } from "react";
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
import { ExportOptions } from "../export-option-mols/ExportOptions";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { exportProject, updateProject } from "../../apis/ProjectApi";
import { exportOptions } from "../../utils/constant";
import { useLoadingStore } from "../../store/useLoadingStore";
import "./ExportForm.css";
import UploadButton from "../export-youtube-option-mols/UploadButton";
import { useVideoContext } from "../../utils/context/VideoContext";
import { uploadToCloudinary } from "../../apis/ProjectApi";

export const ExportForm = ({ isOpen, toggle }) => {
  const { projectInfo, videoThumbnail } = useProjectContext();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const { projectVideo } = useVideoContext();

  const handleExportProject = async () => {
    try {
      setIsLoading(true);
      const cloudinaryUrl = await uploadToCloudinary(projectVideo);
      projectInfo.asset = cloudinaryUrl;
      updateProject(projectInfo);
      await exportProject(projectInfo.id, ".mov");
    } catch (error) {
      console.error("Error sending files to the server:", error);
    } finally {
      setIsLoading(false);
    }
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
        <h3 className="fs-6 mb-3">Cover image and video</h3>
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
        <Button
          className="bg-custom-primary text-dark"
          onClick={handleExportProject}
        >
          Export
        </Button>
        <UploadButton />
      </ModalFooter>
    </Modal>
  );
};
