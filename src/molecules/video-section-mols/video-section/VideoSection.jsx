import React from "react";
import { FaPlus, FaGoogleDrive, FaDropbox } from "react-icons/fa";

export const VideoSection = () => {
  const triggerFileInput = () => {
    document.getElementById("video-section__file-input").click();
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 vh-40 bg-success bg-opacity-25">
      <input
        type="file"
        id="video-section__file-input"
        accept="video/mp4"
        multiple
        className="d-none"
      />
      <div className="bg-white rounded-4 p-4 shadow d-flex flex-column align-items-center text-center w-25 mx-5">
        <div
          className="bg-info w-30 text-white p-3 rounded-4 d-flex align-items-center justify-content-center mb-2"
          onClick={triggerFileInput}
          style={{ cursor: "pointer" }}
        >
          <FaPlus size={30} />
        </div>
        <p className="fw-bold mb-1">Click to upload</p>
        <p className="text-secondary mb-3">Drag and drop files here</p>
        <div className="d-flex gap-2">
          <button className="btn btn-light border">
            <FaGoogleDrive size={20} />
          </button>
          <button className="btn btn-light border">
            <FaDropbox size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
