import React from "react";
import { InputField } from "../../atoms/inputs/InputField";
import { ExportFormButton } from "../../atoms/buttons/ExportFormButton";
import { ThumbnailPreview } from "../../atoms/medias/ThumbnailPreview";
import { ExportOptions } from "../export-option-mols/ExportOptions";
import "./ExportForm.css";

export const ExportForm = () => {
  const handleExportProject = async (projectVideo) => {
    try {
      const formData = new FormData();
      const videoFile = new File([projectVideo], "merged_video.mp4", {
        type: "video/mp4",
      });
      formData.append("file", videoFile);
      formData.append("outputVideoPath", ".mkv");
      await exportProject(formData);
    } catch (error) {
      console.error("Error sending files to the server:", error);
    }
  };

  return (
    <div
      className="container p-4 border rounded bg-white"
      style={{ maxWidth: "300px" }}
    >
      <h3 className="fs-6 mb-3">Cover image and video</h3>
      <div className="mb-3">
        <ThumbnailPreview
          src="https://via.placeholder.com/300x150"
          alt="Video thumbnail"
          className="img-fluid rounded"
        />
      </div>
      <InputField placeholder="Name" className="form-control mb-3" />
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
