import axios from "axios";
import {
  API_URL,
  CLOUD_NAME,
  UPLOAD_PRESET,
  ContentType,
} from "../utils/constant";
import { AutoDismissToast } from "../molecules/auto-dismiss-toast-mols/AutoDismissToast";

export const addBackGroundToProject = async (formData) => {
  return axios.post(`${API_URL}/background`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
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

export const exportProject = async (formData) => {
  return axios.get(`${API_URL}/project/exportProject`, formData, {
    headers: {
      "Content-Type": ContentType.FormData,
    },
  });
};

export const intergrateLyricToVide = async (formData) => {
  return axios.post(`http://localhost:8080/Lyrimix/process`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
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
