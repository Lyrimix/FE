import { useRef, useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { getVideoDuration, extractVideoName } from "../../../utils/file";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { CLOUD_NAME } from "../../../utils/constant";
import { uploadToCloudinary } from "../../../apis/ProjectApi";

const ffmpeg = createFFmpeg({ log: false });

const VideoMerger = ({ files = [] }) => {
  const videoRef = useRef(null);
  const [mergedVideo, setMergedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoName, setVideoName] = useState(null);
  const [background, setBackground] = useState(null);
  const { setFileLength, ranges, setProjectVideo, selectedBackground } =
    useVideoContext();

  const ensureFFmpegLoaded = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
  };

  const trimFirstVideo = async (file, range) => {
    await ffmpeg.FS("writeFile", "input0.mp4", await fetchFile(file.file));
    await ffmpeg.run(
      "-i",
      "input0.mp4",
      "-ss",
      range[0].toString(),
      "-to",
      range[1].toString(),
      "-c",
      "copy",
      "trimmed0.mp4"
    );
  };

  const writeAdditionalFiles = async (additionalFiles) => {
    for (let i = 0; i < additionalFiles.length; i++) {
      await ffmpeg.FS(
        "writeFile",
        `input${i + 1}.mp4`,
        await fetchFile(additionalFiles[i].file)
      );
    }
  };

  const createConcatFile = async (fileCount) => {
    const fileList = [`file 'trimmed0.mp4'`]
      .concat(
        Array.from(
          { length: fileCount - 1 },
          (_, i) => `file 'input${i + 1}.mp4'`
        )
      )
      .join("\n");
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
      "output.mp4"
    );
    const mergedData = ffmpeg.FS("readFile", "output.mp4");
    return new Blob([mergedData.buffer], { type: "video/mp4" });
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
    setLoading(false);
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
      setMergedVideo(URL.createObjectURL(mergedBlob));
      const uploadUrl = await uploadToCloudinary(mergedBlob);

      if (uploadUrl) {
        setVideoName(extractVideoName(uploadUrl));
      }
      setLoading(false);
    };
    getDurations();
    createBlobFromFiles();
  }, [files]);

  useEffect(() => {
    if (!files.length) return;

    const processVideos = async () => {
      try {
        setLoading(true);
        await ensureFFmpegLoaded();

        await trimFirstVideo(files[0], ranges[0]);

        await writeAdditionalFiles(files.slice(1));

        await createConcatFile(files.length);

        const mergedBlob = await mergeVideos();

        await handleMergedVideo(mergedBlob);
      } catch (error) {
        console.error("Video processing failed:", error);
      } finally {
        setLoading(false);
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

      // I currently need this line to test the result because i havent implemented database save for it
      console.log("url:", transformedVideo);

      try {
        const response = await fetch(transformedVideo);
        const blob = await response.blob();
        setMergedVideo(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    fetchAndSetMergedVideo();
  }, [videoName, background]);

  return (
    <div className="d-flex flex-column align-items-center w-100 h-100">
      {loading && (
        <p className="text-warning mb-2 fs-6">🔄 Updating Project...</p>
      )}
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
