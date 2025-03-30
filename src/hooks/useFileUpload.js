import axios from "axios";
import { addBackGroundToProject } from "../apis/ProjectApi";
import { useProjectContext } from "../utils/context/ProjectContext";
import { useVideoContext } from "../utils/context/VideoContext";
import { API_URL, ContentType } from "../utils/constant";
import { getVideoDuration } from "../utils/file";
import { useLoadingStore } from "../store/useLoadingStore";


export const useFileUpload = () => {
  const { selectedFiles, setSelectedFiles, previewUrls, setPreviewUrls } =
    useVideoContext();
  const { projectInfo, setProjectInfo, projectLength, setProjectLength
  ,projectVideosID,setProjectVideosId
  } =
    useProjectContext();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

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
          `${API_URL}/project/createProject`,
          { name: "Nga's project" },
          { headers: { "Content-Type": ContentType.Json } }
        );

        if (!response.data?.result) {
          throw new Error("Invalid project creation response");
        }

        projectId = response.data.result.id;
        setProjectInfo({
          id: projectId,
          name: response.data.result.name,
          uploadTime: response.data.result.uploadTime,
          length: projectLength,
          asset: null,
          videos: [],
        });
      } catch (error) {
        console.error("Project creation failed:", error);
        return;
      }
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      let totalLength = 0;

      for (const file of validFiles) {
        const fileLength = await getVideoDuration(file);
        totalLength += fileLength;
        formData.append("files", file);
      }
      formData.append("projectId", projectId);

      const backgroundResponse = await addBackGroundToProject(formData);
      const projectVideoIds = backgroundResponse.data.result.map((item) => item.asset).reverse();
      setProjectVideosId(projectVideoIds)
      if (!backgroundResponse.data?.result) {
        throw new Error("Invalid background upload response");
      }
      setProjectLength((prev) => prev + totalLength);
      setProjectInfo((prev) => ({
        ...prev,
        videos: prev?.videos
          ? [...prev.videos, ...backgroundResponse.data.result]
          : [...backgroundResponse.data.result],
        length: (prev?.length || 0) + totalLength,
      }));
    } catch (error) {
      console.error("Background upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedFiles,
    previewUrls,
    projectInfo,
    uploadFiles,
  };
};
