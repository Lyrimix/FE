import { useState, useEffect } from "react";
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
import { ratioSizes } from "../../../utils/constant";
import { CLOUD_NAME } from "../../../utils/constant";

const ffmpeg = createFFmpeg({ log: false });

const VideoMerger = ({ files = [] }) => {
  const [mergedVideo, setMergedVideo] = useState(null);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [videoName, setVideoName] = useState(null);
  const [background, setBackground] = useState(null);
  const {
    setFileLength,
    ranges,
    setProjectVideo,
    projectVideo,
    selectedBackground,
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
  } = useProjectContext();
  const [isInRange, setIsInRange] = useState(true);
  const [isRendered, setIsRendered] = useState(false);
  const [isFirstUpload, setIsFirstUpload] = useState(true);

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
      if (!isSeeking) {
        video.play().catch((err) => console.error("Play error:", err));
      }
    };

    const handlePause = () => {
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

  const ensureFFmpegLoaded = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
  };
  const trimAndWriteVideosToFS = async (
    files,
    ranges,
    isFirstUpload,
    setProjectVideosId
  ) => {
    if (isFirstUpload) {
      const originalUrls = files.map((file) => file);
      console.log("ranges:", ranges);
      setOriginalStartAndEndTime(ranges);
      setProjectVideosId(originalUrls);
      return;
    }
    const rangesReverse = [...ranges];

    const trimmedUrls = files
      .map((file, index) => {
        if (!rangesReverse[index]) {
          console.error(`ERROR: Missing range for video index ${index}`);
          return null;
        }

        let videoStart = originalStartAndEndTime[index][0];
        let videoEnd = originalStartAndEndTime[index][1];
        let originalStart = rangesReverse[index][0];
        let originalEnd = rangesReverse[index][1];
        console.log("original end:", originalEnd);

        let duration = originalEnd - originalStart;
        console.log("duration:", duration);
        if (duration <= 0) {
          console.error(
            `ERROR: Invalid range [${originalStart}s - ${originalEnd}s] for video index ${index}`
          );
          return null;
        }

        const videoUrl = file;
        if (!videoUrl) {
          console.error(`ERROR: Invalid file for index ${index}`);
          return null;
        }

        const videoName = videoUrl.split("/").pop();
        console.log("original start:", originalStart);
        let so = index === 0 ? originalStart : originalStart - videoStart;
        if (so < 0) so = 0; // 🔹 FIX: Đảm bảo so không bị âm
        const eo = so + duration;
        const trimmedUrl = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_${so},eo_${eo}/${videoName}`;

        // console.log(`Trimmed Video URL: ${trimmedUrl}`);
        return trimmedUrl;
      })
      .filter(Boolean);

    console.log("trimmed:", trimmedUrls);
    setProjectVideosId(trimmedUrls);
  };

  const mergeVideos = async (videoIds) => {
    console.log("videoIds:", videoIds);

    const mergedVideoUrl = await concatVideoUsingCloudinary(videoIds);
    console.log("Merged video URL:", mergedVideoUrl);
    console.log("projectInfo:", projectInfo);
    const updatedVideos = [...projectInfo.videos].reverse();
    setCloudinaryUrl(mergedVideoUrl);
    console.log("ratio:", ratioSizes[projectRatio] || projectRatio);
    updateProject({
      ...projectInfo,
      videos: updatedVideos,
      asset: mergedVideoUrl,
      size: ratioSizes[projectRatio] || projectRatio,
    });

    try {
      const response = await fetch(mergedVideoUrl);
      if (!response.ok) throw new Error("Failed to fetch merged video");

      const videoBlob = await response.blob();
      const videoFile = new File([videoBlob], "merged.mp4", {
        type: "video/mp4",
      });
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

  const handleMergedVideo = async (blob) => {
    setProjectVideo(blob);
    const url = URL.createObjectURL(blob);
    console.log("url:", url);
    setMergedVideo(url);
    // setProjectVideo(url);

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
      if (projectVideosID && projectVideosID.length > 0) {
        setIsLoading(true);
        try {
          const blob = await mergeVideos(projectVideosID);
          await handleMergedVideo(blob);
        } catch (error) {
          console.error("Error merging videos:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    mergeWhenReady();
  }, [projectVideosID]);

  useEffect(() => {
    if (!files.length || !ranges.length) return;

    const processVideos = async () => {
      try {
        await ensureFFmpegLoaded();

        if (isFirstUpload) {
          await trimAndWriteVideosToFS(
            projectVideosID,
            ranges,
            true,
            setProjectVideosId
          );
          setIsFirstUpload(false);
        } else {
          await trimAndWriteVideosToFS(
            projectVideosID,
            ranges,
            false,
            setProjectVideosId
          );
        }
      } catch (error) {
        console.error("Video processing failed:", error);
      } finally {
      }
    };

    processVideos();
  }, [files, ranges]);

  useEffect(() => {
    if (selectedBackground) {
      const backgroundName = extractVideoName(selectedBackground);

      const isSample = selectedBackground.includes("/samples/");

      const formattedBackground = isSample
        ? `samples:${backgroundName}`
        : backgroundName;

      setBackground(formattedBackground);
    }
  }, [selectedBackground]);

  useEffect(() => {
    const fetchAndSetMergedVideo = async () => {
      if (!mergedVideo || !selectedBackground) return;

      try {
        const transformedVideo = generateCloudinaryUrl(videoName, background);
        setCloudinaryUrl(transformedVideo);
        setProjectInfo((prev) => ({
          ...prev,
        }));
        setIsLoading(true);
        console.log("transformedVideo:", transformedVideo);
        const videoBlob = await fetchVideoBlob(transformedVideo);
        setVideoFile(
          new File([videoBlob], "mergedVideo.mp4", { type: "video/mp4" })
        );
        setProjectVideo(videoBlob);

        const responseLyric = await getLyricById(projectInfo.id);
        if (responseLyric.data.length === 0) {
          setMergedVideo(URL.createObjectURL(videoBlob));
          const cloudinaryUrl = await uploadToCloudinary(transformedVideo);
          projectInfo.asset = cloudinaryUrl;
          updateProject(projectInfo);
          return;
        }
        const finalVideo = await processVideoWithLyrics(
          videoBlob,
          projectInfo.id,
          addExistLyricForVideo
        );
        setMergedVideo(URL.createObjectURL(finalVideo));
        const cloudinaryUrl = await uploadToCloudinary(finalVideo);
        projectInfo.asset = cloudinaryUrl;
        updateProject(projectInfo);
      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetMergedVideo();
  }, [videoName, background]);

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
            controls
            className="w-100 h-100 rounded-3 object-fit-cover"
            onLoadedData={() => setIsRendered(true)}
          />
          {!isInRange && (
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-100" />
          )}
        </>
      )}
    </div>
  );
};

export default VideoMerger;
