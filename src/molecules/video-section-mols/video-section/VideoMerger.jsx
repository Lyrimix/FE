import { useRef, useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { getVideoDuration, extractVideoName } from "../../../utils/file";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { CLOUD_NAME } from "../../../utils/constant";
import { uploadToCloudinary } from "../../../apis/ProjectApi";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { useLoadingStore } from "../../../store/useLoadingStore";

const ffmpeg = createFFmpeg({ log: false });

const VideoMerger = ({ files = [] }) => {
  const videoRef = useRef(null);
  const [mergedVideo, setMergedVideo] = useState(null);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [videoName, setVideoName] = useState(null);
  const [background, setBackground] = useState(null);
  const { setFileLength, ranges, setProjectVideo, selectedBackground } =
    useVideoContext();
  const { setVideoFile, videoBlob, setCloudinaryUrl, setProjectInfo } =
    useProjectContext();

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

  const writeVideosToFS = async (files) => {
    for (let i = 0; i < files.length; i++) {
      await ffmpeg.FS(
        "writeFile",
        `input${i}.mp4`,
        await fetchFile(files[i].file)
      );
    }
  };

  const createConcatFile = async (files) => {
    const fileList = files.map((_, i) => `file 'input${i}.mp4'`).join("\n");
    await ffmpeg.FS("writeFile", "fileList.txt", fileList);
  };

  const mergeVideos = async () => {
    await ffmpeg.run(
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      "fileList.txt",
      "-c",
      "copy",
      "-fflags",
      "+genpts",
      "-reset_timestamps",
      "1",
      "merged.mp4"
    );

    const mergedData = ffmpeg.FS("readFile", "merged.mp4");
    const mergedBlob = new Blob([mergedData.buffer], { type: "video/mp4" });

    return mergedBlob;
  };

  const trimMergedVideo = async (ranges) => {
    const start = ranges[0][0];
    const end = ranges[ranges.length - 1][1];

    await ffmpeg.run(
      "-i",
      "merged.mp4",
      "-ss",
      start.toString(),
      "-to",
      end.toString(),
      "-c",
      "copy",
      "final_trimmed.mp4"
    );

    const trimmedData = ffmpeg.FS("readFile", "final_trimmed.mp4");
    const trimmedBlob = new Blob([trimmedData.buffer], { type: "video/mp4" });

    return trimmedBlob;
  };

  const handleMergedVideo = async (blob) => {
    setProjectVideo(blob);
    const url = URL.createObjectURL(blob);
    setMergedVideo(url);

    const uploadUrl = await uploadToCloudinary(blob);
    if (uploadUrl) {
      setVideoName(extractVideoName(uploadUrl));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!files.length) {
      return;
    }
    setIsLoading(false);
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
      setIsLoading(false);
      setMergedVideo(URL.createObjectURL(mergedBlob));
      setProjectVideo(mergedBlob);
      const uploadUrl = await uploadToCloudinary(mergedBlob);

      if (uploadUrl) {
        setVideoName(extractVideoName(uploadUrl));
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    getDurations();
    createBlobFromFiles();
  }, [files]);

  useEffect(() => {
    if (!files.length || files.length < 2) return;

    const processVideos = async () => {
      try {
        setIsLoading(true);
        await ensureFFmpegLoaded();

        await writeVideosToFS(files);

        await createConcatFile(files);

        await mergeVideos();

        const trimmedBlob = await trimMergedVideo(ranges);

        await handleMergedVideo(trimmedBlob);
      } catch (error) {
        console.error("Video processing failed:", error);
      } finally {
        setIsLoading(false);
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

      const transformedVideo = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/l_${background},fl_relative,w_1.0,h_1.0,c_fill/${videoName}`;
      setCloudinaryUrl(transformedVideo);
      setProjectInfo((prev) => ({
        ...prev,
      }));
      setIsLoading(true);
      try {
        const response = await fetch(transformedVideo);
        const blob = await response.blob();
        setVideoFile(
          new File([blob], "mergedVideo.mp4", { type: "video/mp4" })
        );
        setMergedVideo(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetMergedVideo();
  }, [videoName, background]);

  return (
    <div className="d-flex flex-column align-items-center w-100 h-100">
      {mergedVideo && (
        <video
          ref={videoRef}
          src={mergedVideo}
          controls
          className="w-100 h-100 rounded-3"
        />
      )}
    </div>
  );
};

export default VideoMerger;
