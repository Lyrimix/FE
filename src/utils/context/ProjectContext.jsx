import React, { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectInfo, setProjectInfo] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
export const useProjectContext = () => useContext(ProjectContext);
