import eventBus from "./eventBus";
import { EVENT_BUS_EVENTS } from "./constant";

let globalTime = 0;

eventBus.on(EVENT_BUS_EVENTS.TIME_UPDATED, (time) => {
  globalTime = time;
});

import { addExistLyricForVideo, getLyricById } from "../apis/ProjectApi";
export const extractVideoName = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const getVideoDuration = (file) => {
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

export const clampActionsToFileLength = (newData, fileLength) => {
  return newData.map((item) => ({
    ...item,
    actions: item.actions.map((action, index) => {
      const startTime = action.start;
      let endTime = action.end;
      const maxDuration = fileLength[index] || Infinity;

      if (endTime > maxDuration) {
        alert(
          `End time ${endTime} exceeds file length ${maxDuration}. Clamping to max.`
        );
        return {
          ...action,
          end: startTime + maxDuration,
          maxEnd: maxDuration,
        };
      }
      return action;
    }),
  }));
};

export const generateEffectsFromFiles = (selectedFiles, videoRef) => {
  return selectedFiles.reduce((acc, fileObj, index) => {
    if (!fileObj || !fileObj.file || !fileObj.url) {
      return acc;
    }

    return {
      ...acc,
      [`effect${index}`]: {
        id: `effect${index}`,
        name: fileObj.file.name || `Unnamed Effect ${index}`,
        data: { src: fileObj.url },
        source: {
          enter: ({ action }) => {
            const stopAtEnd = () => {
              if (videoRef.current.currentTime >= action.end) {
                videoRef.current.pause();
                videoRef.current.removeEventListener("timeupdate", stopAtEnd);
              }
            };
            if (videoRef.current) {
              videoRef.current.currentTime = action.start;
              videoRef.current.addEventListener("timeupdate", stopAtEnd);
            }
          },

          leave: () => {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            }
          },
          update: ({ time }) => {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.currentTime = time;
            }
          },
        },
      },
    };
  });
};

export const fetchVideoBlob = async (videoUrl) => {
  const response = await fetch(videoUrl);
  return await response.blob();
};

export const convertBase64ToBlob = (base64String) => {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: "video/mp4" });
};

export const processVideoWithLyrics = async (
  videoBlob,
  projectId,
  apiFunction
) => {
  const responseLyric = await getLyricById(projectId);
  if (responseLyric.data.length === 0) return videoBlob;

  const formData = new FormData();
  formData.append("file", videoBlob);
  formData.append("projectId", projectId);

  const response = await apiFunction(formData);
  return convertBase64ToBlob(response.data.result);
};
