import { useRef, useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { getVideoDuration, extractVideoName } from "../../../utils/FileUtil";
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

  useEffect(() => {
    if (!files.length) return;
    setLoading(false);
    const getDurations = async () => {
      let durations = [];
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
      setLoading(false);
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

    const mergeVideos = async () => {
      setLoading(true);

      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      await ffmpeg.FS(
        "writeFile",
        "input0.mp4",
        await fetchFile(files[0].file)
      );

      await ffmpeg.run(
        "-i",
        "input0.mp4",
        "-ss",
        ranges[0][0].toString(),
        "-to",
        ranges[0][1].toString(),
        "-c",
        "copy",
        "trimmed0.mp4"
      );

      for (let i = 1; i < files.length; i++) {
        await ffmpeg.FS(
          "writeFile",
          `input${i}.mp4`,
          await fetchFile(files[i].file)
        );
      }

      const listFileContent = [`file 'trimmed0.mp4'`]
        .concat(files.slice(1).map((_, i) => `file 'input${i + 1}.mp4'`))
        .join("\n");
      ffmpeg.FS("writeFile", "fileList.txt", listFileContent);

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
      const mergedBlob = new Blob([mergedData.buffer], { type: "video/mp4" });

      setProjectVideo(mergedBlob);
      setMergedVideo(URL.createObjectURL(mergedBlob));
      const uploadUrl = await uploadToCloudinary(mergedBlob);

      if (uploadUrl) {
        setVideoName(extractVideoName(uploadUrl));
      }
      setLoading(false);
    };

    mergeVideos();
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
