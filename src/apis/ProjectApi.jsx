import axios from "axios";
import { API_URL, CLOUD_NAME, UPLOAD_PRESET } from "../utils/constant";

export const addBackGroundToProject = async (formData) => {
  return axios.post(`${API_URL}/background`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProjectById = async (projectId) => {
  return axios.get(`${API_URL}/project?id=${projectId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateProject = async (projectInfo) => {
  return axios.patch(`${API_URL}/project/updateProject`, projectInfo, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteBackGround = async (backgroundId) => {
  return axios.delete(`${API_URL}/background?backgroundId=${backgroundId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const exportProject = async (formData) => {
  return axios.get(`${API_URL}/project/exportProject`, formData, {
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
      console.error("Upload failed", data);
      return null;
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};
