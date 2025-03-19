export const updateProjectBackgrounds = (projectInfo, ranges,cloudinaryUrl) => {
  const updatedVideos = projectInfo.videos.map((bg, index) => ({
    ...bg,
    startTime: ranges[index]?.[0] || 0,
    endTime: ranges[index]?.[1] || 0,
  }));

  const projectLength = updatedVideos.length > 0 
    ? Math.max(...updatedVideos.map(video => video.endTime))
    : 0;

  return {
    ...projectInfo,
    videos: updatedVideos,
    length: projectLength,
    asset: cloudinaryUrl
  };
};

export const generateTimelineData = (
  selectedFiles,
  fileLength,
  maxDuration
) => {
  let accumulatedStart = 0;

  const timelineData = [
    {
      id: "singleRow",
      actions: selectedFiles.map((file, index) => {
        const start = accumulatedStart;
        const duration = fileLength[index] || maxDuration;
        const end = start + duration;
        accumulatedStart = end;

        return {
          id: `action${index}`,
          start,
          end,
          effectId: `effect${index}`,
        };
      }),
    },
  ];

  return timelineData;
};


