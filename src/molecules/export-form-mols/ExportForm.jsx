import React from "react";
import { ThumbnailPreview } from "../../atoms/medias/ThumbnailPreview";
import { ExportOptions } from "../export-option-mols/ExportOptions";
import { Input, FormGroup, Label } from "reactstrap";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { exportProject } from "../../apis/ProjectApi";
import "./ExportForm.css";

export const ExportForm = () => {
  const { projectInfo } = useProjectContext();

  const handleExportProject = async () => {
    try {
      await exportProject(projectInfo.id, ".mov");
    } catch (error) {
      console.error("Error sending files to the server:", error);
    }
  };

  return (
    <div className="container p-4 border rounded bg-white">
      <h3 className="fs-6 mb-3">Cover image and video</h3>
      <div className="mb-3">
        <ThumbnailPreview
          src="https://via.placeholder.com/300x150"
          alt="Video thumbnail"
          className="img-fluid rounded"
        />
      </div>
      <FormGroup className="mb-3">
        <Label for="nameInput">Name</Label>
        <Input id="nameInput" name="name" placeholder="Name" type="text" />
      </FormGroup>
      <ExportOptions className="mb-3" />
      <button
        className="btn bg-custom-primary w-100 mb-2 text-dark"
        onClick={handleExportProject}
      >
        Export
      </button>
      <button className="btn bg-custom-secondary w-100 text-dark">
        Share to YouTube
      </button>
    </div>
  );
};
