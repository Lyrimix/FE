import React, { createContext, useContext, useState, useRef } from "react";
import { AutoDismissToast } from "../../molecules/auto-dismiss-toast-mols/AutoDismissToast";

const VideoContext = createContext();
export const initialDuration = 310;

export const defaultVideoState = {
  selectedFiles: [],
  previewUrls: [],
  ranges: [[0, initialDuration]],
  duration: initialDuration,
  fileLength: [],
  projectVideo: null,
  selectedBackground: null,
  originalDuration: 0,
  trimmedDuration: 0,
  tempEnd: 0,
  afterEnd: 0,
  prevRanges: [],
  currentRange: [],
  isRemoveBackground: false,
  isShowRemoveBgButton: false,
  isAddBackground: false,
  originalVideosAsset: [],
  sortedVideos: [],
  modalOpen: false,
};
export const VideoProvider = ({ children }) => {
  const [sortedVideos, setSortedVideos] = useState(
    defaultVideoState.sortedVideos
  );
  const [modalOpen, setModalOpen] = useState(defaultVideoState.modalOpen);

  const [selectedFiles, setSelectedFiles] = useState(
    defaultVideoState.selectedFiles
  );
  const [previewUrls, setPreviewUrls] = useState(defaultVideoState.previewUrls);
  const [ranges, setRanges] = useState(defaultVideoState.ranges);
  const [duration, setDuration] = useState(defaultVideoState.duration);
  const [fileLength, setFileLength] = useState(defaultVideoState.fileLength);
  const [projectVideo, setProjectVideo] = useState(
    defaultVideoState.projectVideo
  );
  const [selectedBackground, setSelectedBackground] = useState(
    defaultVideoState.selectedBackground
  );
  const [originalDuration, setOriginalDuration] = useState(
    defaultVideoState.originalDuration
  );
  const [trimmedDuration, setTrimmedDuration] = useState(
    defaultVideoState.trimmedDuration
  );
  const [tempEnd, setTempEnd] = useState(defaultVideoState.tempEnd);
  const [afterEnd, setAfterEnd] = useState(defaultVideoState.afterEnd);
  const [prevRanges, setPrevRanges] = useState(defaultVideoState.prevRanges);
  const [currentRange, setCurrentRange] = useState(
    defaultVideoState.currentRange
  );
  const [isRemoveBackground, setIsRemoveBackground] = useState(
    defaultVideoState.isRemoveBackground
  );
  const [isShowRemoveBgButton, setIsShowRemoveBgButton] = useState(
    defaultVideoState.isShowRemoveBgButton
  );
  const [isAddBackground, setIsAddBackground] = useState(
    defaultVideoState.isAddBackground
  );
  const [originalVideosAsset, setOriginalVideosAsset] = useState(
    defaultVideoState.originalVideosAsset
  );
  const fileInputRef = useRef(null);

  const setters = {
    selectedFiles: setSelectedFiles,
    previewUrls: setPreviewUrls,
    ranges: setRanges,
    duration: setDuration,
    fileLength: setFileLength,
    projectVideo: setProjectVideo,
    selectedBackground: setSelectedBackground,
    originalDuration: setOriginalDuration,
    trimmedDuration: setTrimmedDuration,
    tempEnd: setTempEnd,
    afterEnd: setAfterEnd,
    prevRanges: setPrevRanges,
    currentRange: setCurrentRange,
    isRemoveBackground: setIsRemoveBackground,
    isShowRemoveBgButton: setIsShowRemoveBgButton,
    isAddBackground: setIsAddBackground,
    originalVideosAsset: setOriginalVideosAsset,
    setSortedVideos: setSortedVideos,
    modalOpen: setModalOpen,
  };

  const resetVideoContext = () => {
    Object.entries(defaultVideoState).forEach(([key, value]) => {
      if (setters[key]) setters[key](value);
    });
  };

  const handleChange = (index, newRange) => {
    if (!Array.isArray(newRange)) {
      <AutoDismissToast message={("newRange is not an array:", newRange)} />;
      return;
    }
    setRanges((prev) => {
      const updatedRanges = [...prev];
      updatedRanges[index] = newRange;
      return updatedRanges;
    });

    const [newStart, newEnd] = newRange;
    if (newEnd > duration) {
      setDuration(newEnd);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        selectedFiles,
        setSelectedFiles,
        previewUrls,
        setPreviewUrls,
        ranges,
        setRanges,
        duration,
        setDuration,
        handleChange,

        fileLength,
        setFileLength,
        projectVideo,
        setProjectVideo,
        selectedBackground,
        setSelectedBackground,
        originalDuration,
        setOriginalDuration,
        trimmedDuration,
        setTrimmedDuration,
        tempEnd,
        setTempEnd,
        afterEnd,
        setAfterEnd,
        prevRanges,
        setPrevRanges,
        currentRange,
        setCurrentRange,
        isRemoveBackground,
        setIsRemoveBackground,
        isShowRemoveBgButton,
        setIsShowRemoveBgButton,
        isAddBackground,
        setIsAddBackground,
        originalVideosAsset,
        setOriginalVideosAsset,
        resetVideoContext,
        sortedVideos,
        setSortedVideos,
        modalOpen,
        setModalOpen,
        fileInputRef,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);