import { ratioSizes } from "./constant";

export const updateProjectBackgrounds = (projectInfo, ranges, cloudinaryUrl = "", projectRatio = "") => {
  const updatedVideos = projectInfo.videos.map((bg, index) => {
    const startTime = ranges[index]?.[0] || 0;
    const endTime = ranges[index]?.[1] || 0;
    const duration = endTime - startTime;

    return {
      ...bg,
      startTime,
      endTime,
      duration,
    };
  });

  const projectLength =
    updatedVideos.length > 0
      ? Math.max(...updatedVideos.map((video) => video.endTime))
      : 0;
  console.log("project range:",projectLength)
  return {
    ...projectInfo,
    videos: updatedVideos,
    length: projectLength,
    ...(cloudinaryUrl && { asset: cloudinaryUrl }), 
    ...(projectRatio && { size: ratioSizes[projectRatio] || projectRatio }) 
  };
};


export const generateTimelineData = (selectedFiles, fileLength, maxDuration) => {
  let accumulatedStart = 0;

  const sortedFiles = selectedFiles
    .map((file, index) => ({
      file,
      duration: fileLength[index] || maxDuration,
    }))
    .sort((a, b) => a.duration - b.duration);

  const timelineData = [
    {
      id: "singleRow",
      actions: sortedFiles.map(({ file, duration }, index) => {
        const start = accumulatedStart;
        const end = start + duration;
        accumulatedStart = end;

        return {
          id: `action${index}`,
          start,
          end,
          effectId: `effect${index}`,
          movable: false,
        };
      }),
    },
  ];

  return timelineData;
};
