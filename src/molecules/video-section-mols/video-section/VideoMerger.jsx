import { useState, useEffect, useRef, useCallback } from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { getVideoDuration } from "../../../utils/file";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { CLOUD_NAME, ENGINE_EVENTS } from "../../../utils/constant";
import {
  uploadToCloudinary,
  addExistLyricForVideo,
  getLyricById,
  updateProject,
} from "../../../apis/ProjectApi";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { useLoadingStore } from "../../../store/useLoadingStore";
import { fetchVideoBlob, processVideoWithLyrics } from "../../../utils/file";
import { concatVideoUsingCloudinary } from "../../../apis/ProjectApi";
import { generateCloudinaryUrl } from "../../../utils/cloudinaryUtils";
import { useSaveContext } from "../../../utils/context/SaveContext";
import { updateVideoAssetWithBackground } from "../../../utils/project";

const VideoMerger = ({ files = [] }) => {
  const [mergedVideo, setMergedVideo] = useState(null);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [videoName, setVideoName] = useState(null);
  const [background, setBackground] = useState(null);
  const {
    setFileLength,
    ranges,
    setProjectVideo,
    selectedBackground,
    currentRange,
    setIsShowRemoveBgButton,
  } = useVideoContext();
  const {
    setVideoFile,
    videoBlob,
    setCloudinaryUrl,
    setProjectInfo,
    videoRef,
    timelineState,
    projectRatio,
    projectVideosID,
    projectInfo,
    originalStartAndEndTime,
    setOriginalStartAndEndTime,
    setProjectVideosId,
    isDemoCutting,
    isFirstTimeCut,
    setOriginalProject,
    videoWithBackgroundThumbnail,
    setVideoWithBackgroundThumbnail,
    videoUrlsWithBackground,
    setVideoUrlsWithBackground,
    cloudinaryUrl,
    currentClickedVideo,
    setPlayerTime,
    setIsPlaying,
  } = useProjectContext();
  const [isInRange, setIsInRange] = useState(true);
  const [isRendered, setIsRendered] = useState(false);
  const prevRangesRef = useRef(ranges);
  const mergeRef = useRef(false);
  const previousRanges = useRef([]);
  const [prevRangeList, setPrevRangeList] = useState([]);
  const prevCurrentRangeRef = useRef([]);
  const pendingUpdateRef = useRef(false);
  const isFirstUploadRef = useRef(true);
  const firstTrimmedUrlsRef = useRef(null);
  const trimCountRef = useRef(0);
  const { setShouldUpdateProject } = useSaveContext();
  const [updatedSoAndEo, setUpdatedSoAndEo] = useState([]);
  const soAndEoList = [];
  const isManuallyPausedRef = useRef(false);

  useEffect(() => {
    let animationFrameId;

    const updateTime = () => {
      if (videoRef.current) {
        setPlayerTime(videoRef.current.currentTime);
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (!pendingUpdateRef.current) {
      return;
    }
    prevCurrentRangeRef.current = [...currentRange];
    pendingUpdateRef.current = false;
  }, [currentRange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || ranges.length === 0) return;

    let timeoutId = null;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;

      const inRange = ranges.some(
        ([start, end]) => currentTime >= start && currentTime <= end
      );

      if (inRange) {
        setIsInRange(true);
        return;
      }

      setIsInRange(false);
      video.pause();

      const nextRange = ranges.find(([start]) => start > currentTime);

      if (nextRange) {
        const gapDuration = nextRange[0] - currentTime;

        timeoutId = setTimeout(() => {
          video.currentTime = nextRange[0];
          video.play();
          setIsInRange(true);
        }, gapDuration * 1000);
      } else {
        video.pause();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [ranges]);

  useEffect(() => {
    if (!timelineState.current || !videoRef.current) return;

    const engine = timelineState.current;
    const video = videoRef.current;
    let isSeeking = false;

    const handlePlay = () => {
      setIsPlaying(true);
      isManuallyPausedRef.current = false; // reset
      if (!isSeeking) {
        video.play().catch((err) => console.error("Play error:", err));
      }
    };

    const handlePause = () => {
      setIsPlaying(true);
      isManuallyPausedRef.current = true; // dùng ref thay vì biến cục bộ // ✅ đánh dấu đang pause
      setIsPlaying(false);
      video.pause();
    };

    const handleBeforeSetTime = () => {
      isSeeking = true;
    };

    const handleAfterSetTime = ({ time }) => {
      video.currentTime = time;
      setTimeout(() => {
        isSeeking = false;
      }, 100);
    };

    engine.listener.on(ENGINE_EVENTS.PLAY, handlePlay);
    engine.listener.on(ENGINE_EVENTS.PAUSE, handlePause);
    engine.listener.on(ENGINE_EVENTS.BEFORE_SET_TIME, handleBeforeSetTime);
    engine.listener.on(ENGINE_EVENTS.AFTER_SET_TIME, handleAfterSetTime);

    return () => {
      engine.listener.off(ENGINE_EVENTS.PLAY, handlePlay);
      engine.listener.off(ENGINE_EVENTS.PAUSE, handlePause);
      engine.listener.off(ENGINE_EVENTS.BEFORE_SET_TIME, handleBeforeSetTime);
      engine.listener.off(ENGINE_EVENTS.AFTER_SET_TIME, handleAfterSetTime);
    };
  }, [timelineState.current, videoRef]);

  useEffect(() => {
    if (!videoBlob) return;
    setMergedVideo(videoBlob);

    return () => URL.revokeObjectURL(videoBlob);
  }, [videoBlob]);

  const shouldSkipTrim = (isFirstUpload) => {
    if (isFirstUpload) {
      trimCountRef.current = 0;
      return true;
    }
    if (trimCountRef.current === 1) {
      trimCountRef.current = 0;
      return true;
    }
    trimCountRef.current++;
    return false;
  };

  const updatePrevRanges = (index, startOffset, endOffset) => {
    previousRanges.current[index] = [startOffset, endOffset];
    setPrevRangeList((prevState) => {
      const newList = [...prevState];
      newList[index] = [startOffset, endOffset];
      return newList;
    });
  };

  const calculateTrimmedRange = (
    index,
    originalStart,
    originalEnd,
    updatedStart,
    updatedEnd
  ) => {
    let startOffset, endOffset;

    if (isFirstTimeCut) {
      if (index === 0) {
        startOffset = updatedStart;
        endOffset = updatedEnd;
      } else {
        startOffset = parseFloat((updatedStart - originalStart).toFixed(3));
        endOffset =
          startOffset + parseFloat((updatedEnd - updatedStart).toFixed(3));
      }
    } else {
      const [previousStartOffset, previousEndOffset] = prevRangeList[index];
      const [previousStart, previousEnd] = prevCurrentRangeRef.current[index];

      startOffset = previousStartOffset + (updatedStart - previousStart);
      endOffset = previousEndOffset - (previousEnd - updatedEnd);
    }

    updatePrevRanges(index, startOffset, endOffset);
    return [startOffset, endOffset];
  };

  const generateTrimmedUrl = (videoUrl, startOffset, endOffset) => {
    const videoName = videoUrl.split("/").pop();
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_${startOffset},eo_${endOffset}/${videoName}`;
  };

  const trimAndWriteVideosToFS = async (
    files,
    ranges,
    isFirstUpload,
    setProjectVideosId
  ) => {
    if (isFirstUpload) {
      setOriginalStartAndEndTime(ranges);
      setProjectVideosId(files);
      trimCountRef.current = 0;

      return;
    }

    if (shouldSkipTrim(isFirstUpload) || firstTrimmedUrlsRef.current) {
      setVideoUrlsWithBackground((prev) => {
        const updated = [...prev];

        if (updated.length == 0) {
          while (updated.length < projectVideosID.length) {
            updated.push(null);
          }
        }

        return updated;
      });

      setVideoWithBackgroundThumbnail((prev) => {
        const updated = [...prev];

        if (updated.length == 0) {
          while (updated.length < projectVideosID.length) {
            updated.push(null);
          }
        }

        return updated;
      });
      return;
    }

    const trimmedUrls = files
      .map((file, index) => {
        const range = currentRange[index];
        if (!range) {
          console.error(`ERROR: Missing range for video index ${index}`);
          return null;
        }

        const [originalStart, originalEnd] = originalStartAndEndTime[index];
        const [updatedStart, updatedEnd] = currentRange[index];
        const [startOffset, endOffset] = calculateTrimmedRange(
          index,
          originalStart,
          originalEnd,
          updatedStart,
          updatedEnd
        );
        soAndEoList.push([startOffset, endOffset]);

        pendingUpdateRef.current = true;
        return generateTrimmedUrl(file, startOffset, endOffset);
      })
      .filter(Boolean);
    setUpdatedSoAndEo(soAndEoList);
    setProjectVideosId(trimmedUrls);
    setVideoUrlsWithBackground((prev) => {
      return updateVideoAssetWithBackground(prev, soAndEoList);
    });
  };

  const mergeVideos = async (videoIds) => {
    const mergedVideoUrl = await concatVideoUsingCloudinary(videoIds);
    setCloudinaryUrl(mergedVideoUrl);
    setShouldUpdateProject(true);

    try {
      const response = await fetch(mergedVideoUrl);
      if (!response.ok) throw new Error("Failed to fetch merged video");

      const videoBlob = await response.blob();
      const videoFile = new File([videoBlob], "merged.mp4", {
        type: "video/mp4",
      });
      setOriginalProject(videoFile);
      setVideoFile(videoFile);
      return videoFile;
    } catch (error) {
      console.error("Error fetching merged video:", error);
      throw error;
    }
  };

  const extractVideoName = (uploadUrl) => {
    const parts = uploadUrl.split("/");
    return parts[parts.length - 1].split(".")[0];
  };

  const normalizeRanges = (ranges) => {
    let newRanges = [];
    let startTime = 0;

    for (let i = 0; i < ranges.length; i++) {
      let duration = ranges[i][1] - ranges[i][0];
      let newStart = startTime;
      let newEnd = newStart + duration;

      newRanges.push([newStart, newEnd]);

      startTime = newEnd;
    }

    return newRanges;
  };

  const handleMergedVideo = async (blob) => {
    setProjectVideo(blob);
    const url = URL.createObjectURL(blob);
    setMergedVideo(url);
    const uploadUrl = await uploadToCloudinary(blob);
    if (uploadUrl) {
      setVideoName(extractVideoName(uploadUrl));
    }
  };

  useEffect(() => {
    if (!files.length) {
      return;
    }

    const getDurations = async () => {
      const durations = [];
      for (let file of files) {
        const duration = await getVideoDuration(file.file);
        durations.push(duration);
      }
      setFileLength(durations);
    };

    const createBlobFromFiles = async () => {
      const videoBuffers = [];

      for (let file of files) {
        const arrayBuffer = await file.file.arrayBuffer();
        videoBuffers.push(new Uint8Array(arrayBuffer));
      }

      const mergedBlob = new Blob(videoBuffers, { type: "video/mp4" });
      setMergedVideo(URL.createObjectURL(mergedBlob));
      setProjectVideo(mergedBlob);
      const uploadUrl = await uploadToCloudinary(mergedBlob);

      if (uploadUrl) {
        setVideoName(extractVideoName(uploadUrl));
      }
    };
    getDurations();
    createBlobFromFiles();
  }, [files]);

  useEffect(() => {
    const mergeWhenReady = async () => {
      if (mergeRef.current) return;
      if (projectVideosID && projectVideosID.length > 0) {
        mergeRef.current = true;
        setIsLoading(true);
        try {
          const blob = await mergeVideos(projectVideosID);
          await handleMergedVideo(blob);
        } catch (error) {
          console.error("Error merging videos:", error);
        } finally {
          setIsLoading(false);
          mergeRef.current = false;
        }
      }
    };
    mergeWhenReady();
  }, [projectVideosID]);

  useEffect(() => {
    if (!files.length || !ranges.length) return;
    const processVideos = async () => {
      try {
        if (isFirstUploadRef.current) {
          await trimAndWriteVideosToFS(
            projectVideosID,
            ranges,
            true,
            setProjectVideosId
          );

          isFirstUploadRef.current = false;
          return;
        } else if (!isDemoCutting) {
          await trimAndWriteVideosToFS(
            projectVideosID,
            ranges,
            false,
            setProjectVideosId
          );
        }
      } catch (error) {
        console.error("Video processing failed:", error);
      }
    };
    processVideos();
  }, [files, ranges]);

  useEffect(() => {
    console.log("projectInfo:", projectInfo);
  }, [projectInfo]);

  useEffect(() => {
    if (
      videoUrlsWithBackground.lenght != 0 &&
      videoUrlsWithBackground[0] != null
    ) {
      setProjectInfo((prev) => {
        return {
          ...prev,
          videos: prev.videos.map((video, index) => ({
            ...video,
            assetWithBackground: videoUrlsWithBackground[index],
          })),
        };
      });
    }
  }, [videoUrlsWithBackground]);

  useEffect(() => {
    if (videoUrlsWithBackground[currentClickedVideo] != null) {
      setIsShowRemoveBgButton(true);
    }
  }, [currentClickedVideo]);

  useEffect(() => {
    const fetchAndSetMergedVideo = async () => {
      console.log("trigering fetchAndSetMergedVideo");

      if (!mergedVideo || !selectedBackground) {
        return;
      }
      try {
        setIsLoading(true);
        const videoBlob = await fetchVideoBlob(cloudinaryUrl);
        setVideoFile(
          new File([videoBlob], "mergedVideo.mp4", { type: "video/mp4" })
        );
        setProjectVideo(videoBlob);

        const responseLyric = await getLyricById(projectInfo.id);
        if (responseLyric.data.length === 0) {
          // setMergedVideo(URL.createObjectURL(videoBlob));
          // projectInfo.asset = cloudinaryUrl;
          // updateProject(projectInfo);
          return;
        }

        const finalVideo = await processVideoWithLyrics(
          videoBlob,
          projectInfo.id,
          addExistLyricForVideo
        );
        setMergedVideo(URL.createObjectURL(finalVideo));
        const newCloudinaryUrl = await uploadToCloudinary(finalVideo);
        projectInfo.asset = newCloudinaryUrl;
        updateProject(projectInfo);
      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetMergedVideo();
  }, [cloudinaryUrl]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center h-100 position-relative"
      style={{
        aspectRatio: projectRatio.replace(":", "/") || "1/1",
      }}
    >
      {mergedVideo && (
        <>
          <video
            ref={videoRef}
            src={mergedVideo}
            // controls
            className="w-100 h-100 rounded-3 object-fit-cover"
            onLoadedData={() => setIsRendered(true)}
          />
        </>
      )}
    </div>
  );
};

export default VideoMerger;
