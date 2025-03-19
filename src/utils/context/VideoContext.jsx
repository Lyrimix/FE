import React, { createContext, useContext, useState } from "react";
import { AutoDismissToast } from "../../molecules/auto-dismiss-toast-mols/AutoDismissToast";

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const initialDuration = 310;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [ranges, setRanges] = useState([[0, initialDuration]]);
  const [duration, setDuration] = useState(initialDuration);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fileLength, setFileLength] = useState([]);
  const [projectVideo, setProjectVideo] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);

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

  const handleRangeChange = (index, newRange) => {
    setRanges((prev) => {
      const updated = [...prev];
      updated[index] = newRange;
      return updated;
    });
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
        currentVideoIndex,
        setCurrentVideoIndex,
        handleRangeChange,
        fileLength,
        setFileLength,
        projectVideo,
        setProjectVideo,
        selectedBackground,
        setSelectedBackground,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);
