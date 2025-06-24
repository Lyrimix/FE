import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useReducer,
} from "react";

const ProjectContext = createContext();

export const defaultProjectState = {
  projectId: null,
  projectInfo: {},
  videoFile: null,
  videoBlob: null,
  projectLength: 0,
  cloudinaryUrl: null,
  projectRatio: "16:9",
  mergedVideo: null,
  alignAttribute: null,
  projectVideosID: [],
  videosDuration: [],
  originalStartAndEndTime: [],
  isDemoCutting: true,
  isFirstTimeCut: true,
  prevSoEo: [],
  originalProject: null,
  currentCutTime: null,
  originalStartEndOffset: [],
  selectedAddBackGroundVideoIndex: null,
  currentClickedVideo: 0,
  videosId: [],
  videoUrlsWithBackground: [],
  isEffect: false,
  videoThumbnail: [],
  videoWithBackgroundThumbnail: [],
  enhancedVideoUrl: null,
  editorData: [],
  videoVersions: [[], []],
  effectType: [],
  transitionVideoVersions: [null, null],
  transitionEffectType: null,
  playerTime: 0,
  isPlaying: false,
  selectedTranslateLang: "en",
};

export const ProjectProvider = ({ children }) => {
  const [projectId, setProjectId] = useState(defaultProjectState.projectId);
  const [projectInfo, setProjectInfo] = useState(
    defaultProjectState.projectInfo
  );
  const [videoFile, setVideoFile] = useState(defaultProjectState.videoFile);
  const [videoBlob, setVideoBlob] = useState(defaultProjectState.videoBlob);
  const [projectLength, setProjectLength] = useState(
    defaultProjectState.projectLength
  );
  const [cloudinaryUrl, setCloudinaryUrl] = useState(
    defaultProjectState.cloudinaryUrl
  );
  const [projectRatio, setProjectRatio] = useState(
    defaultProjectState.projectRatio
  );
  const [mergedVideo, setMergedVideo] = useState(
    defaultProjectState.mergedVideo
  );
  const [alignAttribute, setAlignAttribute] = useState(
    defaultProjectState.alignAttribute
  );
  const [projectVideosID, setProjectVideosId] = useState(
    defaultProjectState.projectVideosID
  );
  const [videosDuration, setVideosDuration] = useState(
    defaultProjectState.videosDuration
  );
  const [originalStartAndEndTime, setOriginalStartAndEndTime] = useState(
    defaultProjectState.originalStartAndEndTime
  );
  const [isDemoCutting, setIsDemoCutting] = useState(
    defaultProjectState.isDemoCutting
  );
  const [isFirstTimeCut, setIsFirstTimeCut] = useState(
    defaultProjectState.isFirstTimeCut
  );
  const [prevSoEo, setPrevSoEo] = useState(defaultProjectState.prevSoEo);
  const [originalProject, setOriginalProject] = useState(
    defaultProjectState.originalProject
  );
  const [currentCutTime, setCurrentCutTime] = useState(
    defaultProjectState.currentCutTime
  );
  const [originalStartEndOffset, setOriginalStartEndOffset] = useState(
    defaultProjectState.originalStartEndOffset
  );
  const [selectedAddBackGroundVideoIndex, setSelectedAddBackGroundVideoIndex] =
    useState(defaultProjectState.selectedAddBackGroundVideoIndex);
  const [currentClickedVideo, setCurrentClickedVideo] = useState(
    defaultProjectState.currentClickedVideo
  );
  const [videosId, setVideosId] = useState(defaultProjectState.videosId);
  const [videoUrlsWithBackground, setVideoUrlsWithBackground] = useState(
    defaultProjectState.videoUrlsWithBackground
  );
  const [isEffect, setIsEffect] = useState(defaultProjectState.isEffect);
  const [videoThumbnail, setVideoThumbnail] = useState(
    defaultProjectState.videoThumbnail
  );
  const [videoWithBackgroundThumbnail, setVideoWithBackgroundThumbnail] =
    useState(defaultProjectState.videoWithBackgroundThumbnail);
  const [enhancedVideoUrl, setEnhancedVideoUrl] = useState(
    defaultProjectState.enhancedVideoUrl
  );
  const [editorData, setEditorData] = useState(defaultProjectState.editorData);
  const [videoVersions, setVideoVersions] = useState(
    defaultProjectState.videoVersions
  );
  const [effectType, setEffectType] = useState(defaultProjectState.effectType);
  const [transitionVideoVersions, setTransitionVideoVersions] = useState(
    defaultProjectState.transitionVideoVersions
  );
  const [transitionEffectType, setTransitionEffectType] = useState(
    defaultProjectState.transitionEffectType
  );
  const [playerTime, setPlayerTime] = useState(defaultProjectState.playerTime);
  const [isPlaying, setIsPlaying] = useState(defaultProjectState.isPlaying);
  const [selectedTranslateLang, setSelectedTranslateLang] = useState(
    defaultProjectState.selectedTranslateLang
  );

  // refs
  const videoRef = useRef(null);
  const timelineState = useRef(null);
  const setOriginalCutTimeRef = useRef(null);

  // gom setter
  const setters = {
    projectId: setProjectId,
    projectInfo: setProjectInfo,
    videoFile: setVideoFile,
    videoBlob: setVideoBlob,
    projectLength: setProjectLength,
    cloudinaryUrl: setCloudinaryUrl,
    projectRatio: setProjectRatio,
    mergedVideo: setMergedVideo,
    alignAttribute: setAlignAttribute,
    projectVideosID: setProjectVideosId,
    videosDuration: setVideosDuration,
    originalStartAndEndTime: setOriginalStartAndEndTime,
    isDemoCutting: setIsDemoCutting,
    isFirstTimeCut: setIsFirstTimeCut,
    prevSoEo: setPrevSoEo,
    originalProject: setOriginalProject,
    currentCutTime: setCurrentCutTime,
    originalStartEndOffset: setOriginalStartEndOffset,
    selectedAddBackGroundVideoIndex: setSelectedAddBackGroundVideoIndex,
    currentClickedVideo: setCurrentClickedVideo,
    videosId: setVideosId,
    videoUrlsWithBackground: setVideoUrlsWithBackground,
    isEffect: setIsEffect,
    videoThumbnail: setVideoThumbnail,
    videoWithBackgroundThumbnail: setVideoWithBackgroundThumbnail,
    enhancedVideoUrl: setEnhancedVideoUrl,
    editorData: setEditorData,
    videoVersions: setVideoVersions,
    effectType: setEffectType,
    transitionVideoVersions: setTransitionVideoVersions,
    transitionEffectType: setTransitionEffectType,
    playerTime: setPlayerTime,
    isPlaying: setIsPlaying,
    selectedTranslateLang: setSelectedTranslateLang,
  };
  const resetProjectContext = () => {
    Object.entries(defaultProjectState).forEach(([key, value]) => {
      if (setters[key]) setters[key](value);
    });
  };

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
        enhancedVideoUrl,
        setEnhancedVideoUrl,
        editorData,
        setEditorData,
        projectId,
        setProjectId,
        videoVersions,
        setVideoVersions,
        effectType,
        setEffectType,
        transitionVideoVersions,
        setTransitionVideoVersions,
        transitionEffectType,
        setTransitionEffectType,
        playerTime,
        setPlayerTime,
        isPlaying,
        setIsPlaying,
        selectedTranslateLang,
        setSelectedTranslateLang,
        resetProjectContext,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
export const useProjectContext = () => useContext(ProjectContext);
