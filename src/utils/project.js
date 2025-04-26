import { ratioSizes, COPY_SUFFIX } from "./constant";
import { getVideoDuration } from "./file";
import {
  addVideosToProject,
  uploadVideoToCloudinary,
  createProject,
} from "../apis/ProjectApi";

export const updateProjectBackgrounds = (
  projectInfo,
  ranges,
  cloudinaryUrl = "",
  projectRatio = "",
  projectVideosID = []
) => {
  const reversedIDs = [...projectVideosID];

  const updatedVideos = projectInfo.videos.map((bg, index) => {
    const startTime = ranges[index]?.[0] || 0;
    const endTime = ranges[index]?.[1] || 0;
    const duration = endTime - startTime;
    const asset = reversedIDs.length > 0 ? reversedIDs[index] : null;

    return {
      ...bg,
      startTime,
      endTime,
      duration,
      ...(asset && { asset }),
    };
  });

  const projectLength =
    updatedVideos.length > 0
      ? Math.max(...updatedVideos.map((video) => video.endTime))
      : 0;

  return {
    ...projectInfo,
    videos: updatedVideos,
    length: projectLength,
    ...(cloudinaryUrl && { asset: cloudinaryUrl }),
    ...(projectRatio
      ? { size: ratioSizes[projectRatio] || projectRatio }
      : { size: "1280x720" }),
  };
};

export const generateTimelineData = (
  selectedFiles,
  fileLength,
  maxDuration
) => {
  let accumulatedStart = 0;

  const sortedFiles = selectedFiles.map((file, index) => ({
    file,
    duration: fileLength[index] || maxDuration,
  }));
  const actions = sortedFiles.flatMap(({ file, duration }, index) => {
    const start = accumulatedStart;
    const end = start + duration;

    accumulatedStart = end;

    return [
      {
        id: `action${index}${COPY_SUFFIX}`,
        start,
        end,
        minStart: -10000,
        maxEnd: 10000,
        flexible: false,
        effectId: `effect${index}${COPY_SUFFIX}`,
        movable: false,
        videoName: file.file.name,
      },
      {
        id: `action${index}`,
        start,
        minStart: -10000,
        maxEnd: 10000,
        maxEnd: 10000,
        end,
        effectId: `effect${index}`,
        movable: false,
        videoName: file.file.name,
      },
    ];
  });

  return [
    {
      id: "singleRow",
      actions: actions,
    },
  ];
};

export const createNewProject = async (setProjectInfo, projectLength) => {
  try {
    const response = await createProject();

    const result = response.data?.result;
    if (!result) throw new Error("Invalid project creation response");

    setProjectInfo({
      id: result.id,
      name: result.name,
      uploadTime: result.uploadTime,
      length: projectLength,
      asset: null,
      videos: [],
      size: result.size,
    });

    return result.id;
  } catch (error) {
    console.error("Project creation failed:", error);
    return null;
  }
};

export const prepareFormData = async (videos) => {
  let totalLength = 0;

  for (const video of videos) {
    const file = video.file;
    const duration = await getVideoDuration(file);
    totalLength += duration;
  }
  return { totalLength };
};

export const updateProjectInfo = (
  newVideos,
  additionalLength,
  setProjectLength,
  setProjectInfo
) => {
  setProjectLength((prev) => prev + additionalLength);
  setProjectInfo((prev) => ({
    ...prev,
    videos: prev?.videos ? [...prev.videos, ...newVideos] : [...newVideos],
    length: (prev?.length || 0) + additionalLength,
  }));
};

export const prepareVideoRequestList = (cloudinaryUrls) => {
  return cloudinaryUrls.map(({ url, duration }) => ({
    asset: removeMp4Extension(url),
    duration,
  }));
};
export const removeMp4Extension = (url) => {
  return url.endsWith(".mp4") ? url.slice(0, -4) : url;
};
export const addAllVideosToProject = async (
  projectId,
  videoRequestList,
  setProjectVideosId
) => {
  const payload = {
    projectId,
    videoRequestList,
  };

  const response = await addVideosToProject(payload);
  return response;
};
export const uploadToCloudinary = async (validFiles) => {
  return await Promise.all(
    validFiles.map((file) => uploadVideoToCloudinary(file))
  );
};
