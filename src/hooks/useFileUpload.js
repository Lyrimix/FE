import axios from "axios";
import { addBackGroundToProject } from "../apis/ProjectApi";
import { useProjectContext } from "../utils/context/ProjectContext";
import { useVideoContext } from "../utils/context/VideoContext";

export const useFileUpload = () => {
  const { selectedFiles, setSelectedFiles, previewUrls, setPreviewUrls } =
    useVideoContext();
  const { projectInfo, setProjectInfo } = useProjectContext();

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) {
      console.error("No file selected");
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

    let projectId = projectInfo?.id;

    if (!projectId) {
      try {
        const response = await axios.post(
          "http://localhost:8080/Lyrimix/project/createProject",
          { name: "Nga's project" },
          { headers: { "Content-Type": "application/json" } }
        );

        if (!response.data?.result) {
          throw new Error("Invalid project creation response");
        }

        projectId = response.data.result.id;
        setProjectInfo({
          id: projectId,
          name: response.data.result.name,
          uploadTime: response.data.result.uploadTime,
          backgrounds: [],
        });
      } catch (error) {
        console.error("Project creation failed:", error);
        return;
      }
    }

    // Upload files as backgrounds
    try {
      const formData = new FormData();
      validFiles.forEach((file) => formData.append("files", file));
      formData.append("projectId", projectId);

      const backgroundResponse = await addBackGroundToProject(formData);

      if (!backgroundResponse.data?.result) {
        throw new Error("Invalid background upload response");
      }

      setProjectInfo((prev) => ({
        ...prev,
        backgrounds: prev?.backgrounds
          ? [...prev.backgrounds, ...backgroundResponse.data.result]
          : [...backgroundResponse.data.result],
      }));
    } catch (error) {
      console.error("Background upload failed:", error);
    }
  };

  return {
    selectedFiles,
    previewUrls,
    projectInfo,
    uploadFiles,
  };
};
