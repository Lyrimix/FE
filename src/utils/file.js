import eventBus from "./eventBus";
import { EVENT_BUS_EVENTS } from "./constant";

let globalTime = 0;

eventBus.on(EVENT_BUS_EVENTS.TIME_UPDATED, (time) => {
  globalTime = time;
});

export const extractVideoName = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const extractCloudinaryVideoId = (uploadUrl) => {
  const parts = uploadUrl.split("/");
  return parts[parts.length - 1].split(".")[0];
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
              // if (videoRef.current.currentTime >= action.end) {
              //   videoRef.current.pause();
              //   videoRef.current.removeEventListener("timeupdate", stopAtEnd);
              // }
            };
            if (videoRef.current) {
              videoRef.current.currentTime = action.start;
              videoRef.current.addEventListener("timeupdate", stopAtEnd);
            }
          },

          // leave: () => {
          //   if (videoRef.current && !videoRef.current.paused) {
          //     videoRef.current.pause();
          //   }
          // },
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
  const formData = new FormData();
  formData.append("file", videoBlob);
  formData.append("projectId", projectId);

  const response = await apiFunction(formData);
  return convertBase64ToBlob(response.data.result);
};

export function bgrToRgb(bgr) {
  bgr = bgr.replace("&H", "").toUpperCase();

  if (bgr.length !== 8) {
    throw new Error("Invalid BGR color format!");
  }

  const alpha = bgr.substring(0, 2);
  const b = bgr.substring(2, 4);
  const g = bgr.substring(4, 6);
  const r = bgr.substring(6, 8);

  const rgb = `#${r}${g}${b}`.toUpperCase();
  let opacity = parseInt(alpha, 16) / 255;
  if (opacity === 0) {
    opacity = 0.1;
  }

  return { rgb, opacity: parseFloat(opacity.toFixed(2)) };
}

export function convertHexToASS(input, alpha = "00") {
  if (typeof input === "object" && input !== null && input.rgb) {
    const { rgb, opacity } = input;
    alpha =
      opacity !== undefined
        ? Math.round((1 - opacity) * 255)
            .toString(16)
            .padStart(2, "0")
        : alpha;
    input = rgb;
  }

  if (typeof input !== "string" || !input) {
    console.error("hexColor is not a valid string:", input);
    return "&H00000000";
  }

  if (!input.startsWith("#") || input.length !== 7) {
    console.error("Invalid hex color format:", input);
    return "&H00000000";
  }

  const r = input.substring(1, 3);
  const g = input.substring(3, 5);
  const b = input.substring(5, 7);

  return `&H${alpha}${b}${g}${r}`.toUpperCase();
}

export const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Snapshot failed"));
        }
      }, "image/jpeg");
    };

    video.onerror = (e) => {
      reject(new Error("Video load error"));
    };
  });
};
