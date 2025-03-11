import axios from "axios";
import { addBackGroundToProject } from "../apis/ProjectApi";

export const MergeVideo = async (event) => {
  const files = Array.from(event.target.files);

  if (files.length === 0) {
    console.error("No file has been selected");
    return;
  }

  const validFiles = files.filter((file) => file.size > 0);
  if (validFiles.length === 0) {
    console.error("All chosen files are empty.");
    return;
  }

  try {
    const formData = new FormData();
    validFiles.forEach((files) => formData.append("files", files));

    const response = await axios.post(
      "https://28-02-testaddsrtdeploy-production.up.railway.app/Lyrimix/merge-media",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      }
    );
  } catch (error) {
    console.error("Error during uploading proccess");
  }
};

export const handleFileSelected = async (
  event,
  selectedFiles,
  setSelectedFiles,
  setPreviewUrls,
  projectInfo,
  setProjectInfo
) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) {
    console.error("No file has been selected");
    return;
  }

  const newVideos = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

  const validFiles = files.filter((file) => file.size > 0);
  if (validFiles.length === 0) {
    console.error("All selected files are empty");
    return;
  }

  setSelectedFiles((prev) => [...prev, ...newVideos]);
  setPreviewUrls(newVideos[newVideos.length - 1].url);

  let projectId = projectInfo?.id || null;

  if (!projectId) {
    try {
      const response = await axios.post(
        "https://deloyapp-production-b11a.up.railway.app/Lyrimix/project/createProject",
        { name: "Nga's project" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.data?.result) {
        throw new Error("API createProject không trả về dữ liệu hợp lệ");
      }

      projectId = response.data.result.id;

      setProjectInfo({
        id: projectId,
        name: response.data.result.name,
        uploadTime: response.data.result.uploadTime,
        backgrounds: [],
      });
    } catch (error) {
      console.error("Lỗi khi tạo project:", error);
      return;
    }
  } else {
  }

  try {
    const formData = new FormData();
    validFiles.forEach((file) => formData.append("files", file));
    formData.append("projectId", projectId);

    const backgroundResponse = await addBackGroundToProject(formData);

    if (!backgroundResponse.data?.result) {
      throw new Error("API addBackgroundToProject không trả về dữ liệu hợp lệ");
    }

    setProjectInfo((prev) => ({
      ...prev,
      backgrounds: prev?.backgrounds
        ? [...prev.backgrounds, ...backgroundResponse.data.result]
        : [...backgroundResponse.data.result],
    }));
  } catch (error) {
    console.error("Lỗi khi upload background:", error);
  }
};
