import axios from "axios";
import {
  API_URL,
  CLOUD_NAME,
  UPLOAD_PRESET,
  ContentType,
} from "../utils/constant";
import { AutoDismissToast } from "../molecules/auto-dismiss-toast-mols/AutoDismissToast";

export const register = async (payload) => {
  return axios.post(`${API_URL}/user`, payload, {
    headers: {
      "Content-Type": ContentType.Json,
    },
  });
};
export const login = async (payload) => {
  return axios.post(`${API_URL}/auth/token`, payload, {
    headers: {
      "Content-Type": ContentType.Json,
    },
  });
};
export const addVideosToProject = async (payload) => {
  return axios.post(`${API_URL}/video`, payload, {
    headers: {
      "Content-Type": ContentType.Json,
    },
  });
};
export const getProjectById = async (projectId) => {
  return axios.get(`${API_URL}/project?id=${projectId}`, {
    headers: {
      "Content-Type": ContentType.Json,
    },
  });
};

export const updateProject = async (projectInfo) => {
  return axios.patch(`${API_URL}/project/updateProject`, projectInfo, {
    headers: {
      "Content-Type": ContentType.Json,
    },
  });
};

export const deleteBackGround = async (backgroundId) => {
  return axios.delete(`${API_URL}/background?backgroundId=${backgroundId}`, {
    headers: {
      "Content-Type": ContentType.Json,
    },
  });
};

export const updatedUserInfo = async (token, payload) => {
  return axios.patch(`${API_URL}/user`, payload, {
    headers: {
      "Content-Type": ContentType.Json,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteProject = async (projectId, token) => {
  return axios.delete(`${API_URL}/project?projectId=${projectId}`, {
    headers: {
      "Content-Type": ContentType.Json,
      Authorization: `Bearer ${token}`,
    },
  });
};
export const exportLyric = async (projectId, selectedFormat) => {
  try {
    const response = await axios.get(`${API_URL}/lyrics/exportLyric`, {
      params: { projectId, selectedFormat },
      responseType: "blob",
      headers: {
        "Content-Type": ContentType.Json,
      },
    });
    const disposition = response.headers["content-disposition"];
    let filename = "lyric" + selectedFormat;
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export and download failed", error);
  }
};
export const exportProject = async (projectId, outputVideoPath) => {
  try {
    const response = await axios.get(`${API_URL}/project/exportProject`, {
      params: { projectId, outputVideoPath },
      responseType: "blob",
      headers: {
        "Content-Type": ContentType.Json,
      },
    });

    const disposition = response.headers["content-disposition"];
    let filename = "video.mp4";
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export and download failed", error);
  }
};

export const intergrateLyricToVideo = async (formData) => {
  return axios.post(`${API_URL}/process`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      <AutoDismissToast message={("Upload failed", data)} />;
      return null;
    }
  } catch (error) {
    <AutoDismissToast message={("Error uploading to Cloudinary:", error)} />;
    return null;
  }
};

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      <AutoDismissToast message={("Upload failed", data)} />;
      return null;
    }
  } catch (error) {
    <AutoDismissToast message={("Error uploading to Cloudinary:", error)} />;
    return null;
  }
};

export const concatVideoUsingCloudinary = (videoIds) => {
  if (!videoIds || videoIds.length === 0) {
    throw new Error("At least one video ID is required");
  }

  const cloudinaryBaseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload`;
  const commonTransform = "c_fill,w_640,h_360";
  const defaultStart = 0;
  const defaultEnd = 102;

  if (videoIds.length === 1) {
    console.warn("Only one video provided, adding default so_0, eo_100");
    return videoIds[0].replace(
      "/upload/",
      `/upload/so_${defaultStart},eo_${defaultEnd}/`
    );
  }

  const cleanedVideoIds = videoIds.map((url) => url.replace(/\/v\d+\//, "/"));

  const updatedVideoIds = cleanedVideoIds.map((url) => {
    const hasStartEnd = /so_\d+/.test(url) && /eo_\d+/.test(url);
    if (!hasStartEnd) {
      return url.replace(
        "/upload/",
        `/upload/so_${defaultStart},eo_${defaultEnd}/`
      );
    }
    return url;
  });

  const extractCloudinaryVideoData = (url) => {
    const match = url.match(/\/upload\/([^/]+)\/([^/.]+)(?:\.[a-z]+)?$/);
    if (!match) return null;

    const transformations = match[1];
    const videoId = match[2];

    return { transformations, videoId };
  };

  const videoList = updatedVideoIds
    .map(extractCloudinaryVideoData)
    .filter((data) => data && data.videoId);

  if (videoList.length < 2) {
    throw new Error("At least two valid video IDs are required");
  }

  let spliceUrl = `${cloudinaryBaseUrl}/${commonTransform},${videoList[0].transformations}`;
  for (let i = 1; i < videoList.length; i++) {
    spliceUrl += `/fl_splice,l_video:${videoList[i].videoId},${videoList[i].transformations},${commonTransform}`;
  }
  spliceUrl += `/fl_layer_apply/${videoList[0].videoId}.mp4`;

  return spliceUrl;
};

export const getLyricById = async (projectId) => {
  return axios.get(`${API_URL}/lyrics/project/${projectId}`, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};

export const updateLyricByProjectId = async (formData) => {
  return axios.put(`${API_URL}/lyrics`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};

export const addExistLyricForVideo = async (formData) => {
  return axios.post(`${API_URL}/lyrics/addAssToVideo`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};

export const showHideLyrics = async (projectId, formData) => {
  return axios.patch(`${API_URL}/lyrics/${projectId}`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};
export const applyTransition = async (formData) => {
  return axios.post(`${API_URL}/video/applyTransition`, formData, {
    headers: {
      "Content-Type": ContentType.Json,
    },
  });
};

export const getAccessToken = async (code) => {
  return axios.post(`${API_URL}/youtube/getAccessToken`, { code });
};

export const uploadYoutube = async (accessToken, projectId) => {
  return axios.post(
    `${API_URL}/youtube/upload?projectId=${projectId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": ContentType.Json,
      },
    }
  );
};

export const removeEffect = async (formData) => {
  return axios.post(`${API_URL}/video/removeEffect`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};

export const uploadVideoToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload video");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    <AutoDismissToast message={("Error uploading to Cloudinary:", error)} />;
    return null;
  }
};

export const createProject = async (token) => {
  console.log("token at api", token);
  return axios.post(
    `${API_URL}/project/createProject`,
    {
      name: "Lyrimix's project",
    },
    {
      headers: {
        "Content-Type": ContentType.Json,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getListProjectByToken = async (token) => {
  return axios.get(`${API_URL}/project/getListProjectByToken`, {
    headers: {
      "Content-Type": ContentType.Json,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addBackgroundToSingleVideo = async (
  videoPath,
  backgroundPath,
  videoId
) => {
  const formData = new FormData();
  formData.append("videoPath", videoPath);
  formData.append("backgroundPath", backgroundPath);
  formData.append("videoId", videoId);
  return axios.post(`${API_URL}/video/addBackground`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};

export const removeBackgroundOfEachVideo = async (videoPath, videoId) => {
  const formData = new FormData();
  formData.append("videoPath", videoPath);
  formData.append("videoId", videoId);
  return axios.post(`${API_URL}/video/removeBackground`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};
