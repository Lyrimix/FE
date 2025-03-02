import { useRef, useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./VideoMerger.css";
import { useVideoContext } from "../../../utils/context/VideoContext";

const ffmpeg = createFFmpeg({ log: false });

const VideoMerger = ({ files = [] }) => {
  const videoRef = useRef(null);
  const [mergedVideo, setMergedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setFileLength, ranges, setProjectVideo } = useVideoContext();

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };

      video.onerror = () => {
        console.error(`Error loading video: ${file.name}`);
        resolve(null);
      };
    });
  };

  useEffect(() => {
    if (!files.length) return;

    const getDurations = async () => {
      let durations = [];
      for (let file of files) {
        const duration = await getVideoDuration(file.file);
        durations.push(duration);
      }
      setFileLength(durations);
    };

    getDurations();
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

      setLoading(false);
    };

    mergeVideos();
  }, [files, ranges]);

  return (
    <div className="video-merger">
      {loading && (
        <p className="video-merger__status">🔄 Concating videos...</p>
      )}
      {mergedVideo && (
        <video
          className="video-merger__preview"
          ref={videoRef}
          src={mergedVideo}
          controls
        />
      )}
    </div>
  );
};

export default VideoMerger;
