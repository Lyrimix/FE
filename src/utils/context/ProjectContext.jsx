import React, { createContext, useContext, useState, useRef } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectInfo, setProjectInfo] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [projectLength, setProjectLength] = useState(0);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const videoRef = useRef(null);
  const timelineState = useRef(null);

  return (
    <ProjectContext.Provider
      value={{
        projectInfo,
        setProjectInfo,
        previewImage,
        setPreviewImage,
        videoFile,
        setVideoFile,
        videoBlob,
        setVideoBlob,
        projectLength,
        setProjectLength,
        cloudinaryUrl,
        setCloudinaryUrl,
        videoRef,
        timelineState,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
export const useProjectContext = () => useContext(ProjectContext);
