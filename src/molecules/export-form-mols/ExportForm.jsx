import React from "react";
import "./ExportForm.css";
import { exportProject } from "../../apis/ProjectApi";
import { useVideoContext } from "../../utils/context/VideoContext";
import { InputField } from "../../atoms/inputs/InputField";
import { ThumbnailPreview } from "../../atoms/medias/ThumbnailPreview";
import { ExportOptions } from "../export-option-mols/ExportOptions";
import { Input, Button, FormGroup, Label } from "reactstrap";
import "./ExportForm.css";

export const ExportForm = () => {
  const { projectVideo } = useVideoContext();

  const handleExportProject = async (projectVideo) => {
    alert("ad");
    try {
      const formData = new FormData();
      const videoFile = new File([projectVideo], "merged_video.mp4", {
        type: "video/mp4",
      });
      formData.append("file", videoFile);
      formData.append("outputVideoPath", ".mkv");
      const response = await exportProject(formData);
      const result = await response.text();
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
          className="thumbnail"
        />
      </div>
      <FormGroup className="mb-3">
        <Label for="nameInput">Name</Label>
        <Input id="nameInput" name="name" placeholder="Name" type="text" />
      </FormGroup>
      <ExportOptions className="mb-3" />
      <ExportFormButton
        className="btn bg-custom-primary w-100 mb-2 text-dark"
        onClick={handleExportProject}
      >
        Export
      </ExportFormButton>
      <ExportFormButton className="btn secondary">
        Share to Youtube
      </ExportFormButton>
    </div>
  );
};
