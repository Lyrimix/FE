export const extractVideoName = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      console.error(`Error loading video: ${file.name}`);
      resolve(null);
    };
  });
};

export const clampActionsToFileLength = (newData, fileLength) => {
  return newData.map((item) => ({
    ...item,
    actions: item.actions.map((action, index) => {
      const startTime = action.start;
      let endTime = action.end;
      const maxDuration = fileLength[index] || Infinity;

      if (endTime > maxDuration) {
        alert(
          `End time ${endTime} exceeds file length ${maxDuration}. Clamping to max.`
        );
        return {
          ...action,
          end: startTime + maxDuration,
          maxEnd: maxDuration,
        };
      }
      return action;
    }),
  }));
};

export const generateEffectsFromFiles = (selectedFiles) => {
  return selectedFiles.reduce(
    (acc, file, index) => ({
      ...acc,
      [`effect${index}`]: { id: `effect${index}`, name: file.name },
    }),
    {}
  );
};
