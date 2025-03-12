export const updateProjectBackgrounds = (projectInfo, ranges) => ({
  ...projectInfo,
  backgrounds: projectInfo.backgrounds.map((bg, index) => ({
    ...bg,
    startTime: ranges[index]?.[0] || 0,
    endTime: ranges[index]?.[1] || 0,
  })),
});

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
