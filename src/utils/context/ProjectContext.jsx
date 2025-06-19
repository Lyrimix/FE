import React, { createContext, useContext, useState, useRef } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectInfo, setProjectInfo] = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [projectLength, setProjectLength] = useState(0);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const videoRef = useRef(null);
  const timelineState = useRef(null);
  const [projectRatio, setProjectRatio] = useState("16:9");
  const [mergedVideo, setMergedVideo] = useState(null);
  const [alignAttribute, setAlignAttribute] = useState(null);
  const [projectVideosID, setProjectVideosId] = useState([]);
  const [videosDuration, setVideosDuration] = useState([]);
  const [originalStartAndEndTime, setOriginalStartAndEndTime] = useState([]);
  const [isDemoCutting, setIsDemoCutting] = useState(true);
  const [isFirstTimeCut, setIsFirstTimeCut] = useState(true);
  const [prevSoEo, setPrevSoEo] = useState([]);
  const [originalProject, setOriginalProject] = useState(null);
  const [currentCutTime, setCurrentCutTime] = useState(null);
  const setOriginalCutTimeRef = useRef(null);
  const [originalStartEndOffset, setOriginalStartEndOffset] = useState([]);
  const [selectedAddBackGroundVideoIndex, setSelectedAddBackGroundVideoIndex] =
    useState(null);
  const [currentClickedVideo, setCurrentClickedVideo] = useState(0);

  //Add and remove background for each video
  const [videosId, setVideosId] = useState([]);
  const [videoUrlsWithBackground, setVideoUrlsWithBackground] = useState([]);
  const [isEffect, setIsEffect] = useState(false);

  //thumbnail
  const [videoThumbnail, setVideoThumbnail] = useState([]);
  const [videoWithBackgroundThumbnail, setVideoWithBackgroundThumbnail] =
    useState([]);
  const [playerTime, setPlayerTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <ProjectContext.Provider
      value={{
        projectInfo,
        setProjectInfo,
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
        projectVideosID,
        setProjectVideosId,
        videosDuration,
        setVideosDuration,
        originalStartAndEndTime,
        setOriginalStartAndEndTime,
        isDemoCutting,
        setIsDemoCutting,
        isFirstTimeCut,
        setIsFirstTimeCut,
        videoThumbnail,
        setVideoThumbnail,
        prevSoEo,
        setPrevSoEo,
        originalProject,
        setOriginalProject,
        currentCutTime,
        setCurrentCutTime,
        setOriginalCutTimeRef,
        originalStartEndOffset,
        setOriginalStartEndOffset,
        selectedAddBackGroundVideoIndex,
        setSelectedAddBackGroundVideoIndex,
        currentClickedVideo,
        setCurrentClickedVideo,
        videosId,
        setVideosId,
        videoUrlsWithBackground,
        setVideoUrlsWithBackground,
        isEffect,
        setIsEffect,
        videoWithBackgroundThumbnail,
        setVideoWithBackgroundThumbnail,
        playerTime,
        setPlayerTime,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
export const useProjectContext = () => useContext(ProjectContext);
