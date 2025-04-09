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
import { exportProject } from "../../apis/ProjectApi";
import { exportOptions } from "../../utils/constant";
import { useLoadingStore } from "../../store/useLoadingStore";
import "./ExportForm.css";
import UploadButton from "../export-youtube-option-mols/UploadButton";

export const ExportForm = ({ isOpen, toggle }) => {
  const { projectInfo, videoThumbnail } = useProjectContext();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const handleExportProject = async () => {
    try {
      setIsLoading(true);
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

        <FormGroup className="mb-3">
          <Input id="nameInput" name="name" placeholder="Name" type="text" />
        </FormGroup>
        <ExportOptions options={exportOptions} className="mb-3" />
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
