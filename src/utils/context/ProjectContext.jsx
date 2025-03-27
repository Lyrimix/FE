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
  const [projectRatio, setProjectRatio] = useState("16:9");
  const [mergedVideo, setMergedVideo] = useState(null);
  const [alignAttribute, setAlignAttribute] = useState(null);

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
        projectRatio,
        setProjectRatio,
        mergedVideo,
        setMergedVideo,
        alignAttribute,
        setAlignAttribute,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
export const useProjectContext = () => useContext(ProjectContext);
