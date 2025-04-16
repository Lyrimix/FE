import { ratioSizes } from "./constant";
import { COPY_SUFFIX } from "./constant";

export const updateProjectBackgrounds = (projectInfo, ranges, cloudinaryUrl = "", projectRatio = "",projectVideosID = []) => {
  const reversedIDs = [...projectVideosID]; 
  
  const updatedVideos = projectInfo.videos.map((bg, index) => {
    const startTime = ranges[index]?.[0] || 0;
    const endTime = ranges[index]?.[1] || 0;
    const duration = endTime - startTime;
    const asset = reversedIDs.length > 0 ? reversedIDs[index] : null 

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
    ...(projectRatio ? { size: ratioSizes[projectRatio] || projectRatio } :   { size: "1280x720"}) 
  };
};

export const generateTimelineData = (selectedFiles, fileLength, maxDuration) => {
  let accumulatedStart = 0;

  const sortedFiles = selectedFiles
    .map((file, index) => ({
      file,
      duration: fileLength[index] || maxDuration,
    }))
  ;

  const actions = sortedFiles.flatMap(({ file, duration }, index) => {
    const start = accumulatedStart;
    const end = start + duration;
    
    accumulatedStart = end;

    return [
      {
        id: `action${index}${COPY_SUFFIX}`,
        start,  
        end,
        minStart:-10000,
        maxEnd:10000,
        flexible: false,
        effectId: `effect${index}${COPY_SUFFIX}`,
        movable: false,
      },
      {
        id: `action${index}`,
        start,
        minStart:-10000,
        maxEnd:10000,
        maxEnd:10000,
        end,
        effectId: `effect${index}`,
        movable: false,
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
