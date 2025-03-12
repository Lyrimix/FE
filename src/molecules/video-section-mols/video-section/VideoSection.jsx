import React, { useEffect, useState } from "react";
import { FaPlus, FaGoogleDrive, FaDropbox } from "react-icons/fa";
import { useFileUpload } from "../../../hooks/useFileUpload";
import VideoMerger from "./VideoMerger";
import "./VideoSection.css";

export const VideoSection = () => {
  const { selectedFiles, uploadFiles } = useFileUpload();
  const [mergedFiles, setMergedFiles] = useState(selectedFiles);

  const triggerFileInput = () => {
    document.getElementById("video-section__file-input").click();
  };

  useEffect(() => {
    setMergedFiles([...selectedFiles]);
  }, [selectedFiles]);

  return (
    <div className="bg-custom-green d-flex flex-column justify-content-center align-items-center w-100 h-100">
      <input
        type="file"
        id="video-section__file-input"
        accept="video/mp4"
        multiple
        className="d-none"
        onChange={uploadFiles}
      />

      {!selectedFiles.length ? (
        <div className="w-25 ms-5 d-flex flex-column align-items-center p-4 bg-white rounded-5  shadow text-center">
          <div
            className="cursor-pointer bg-info w-30 text-white p-3 rounded-4 d-flex align-items-center justify-content-center mb-2"
            onClick={triggerFileInput}
          >
            <FaPlus size={30} />
          </div>
          <p className="fw-bold mb-1 fs-5">Click to upload</p>
          <p className="text-muted mb-4 fs-6">Drag and drop files here</p>
          <div className="d-flex gap-2">
            <button className="btn btn-light border">
              <FaGoogleDrive size={20} />
            </button>
            <button className="btn btn-light border">
              <FaDropbox size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-100 d-flex justify-content-center h-75">
          <div className="w-50">
            <VideoMerger
              key={mergedFiles.map((file) => file.url).join("-")}
              files={mergedFiles}
              className="w-100 h-100 rounded shadow"
            />
          </div>
        </div>
      )}
    </div>
  );
};
