import { useProjectContext } from "../utils/context/ProjectContext";
import { useVideoContext } from "../utils/context/VideoContext";
import { generateVideoThumbnail } from "../utils/file";
import { useLoadingStore } from "../store/useLoadingStore";

export const useFileUpload = () => {
  const { selectedFiles, previewUrls } = useVideoContext();
  const { projectInfo } = useProjectContext();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const uploadFiles = async (
    event,
    setVideoThumbnail,
    setSortedVideos,
    setModalOpen,
  ) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.size > 0);
    if (validFiles.length === 0) return;

    try {
      const newVideos = validFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        url: URL.createObjectURL(file),
        originalIndex: index,
      }));

      for (const file of validFiles) {
        try {
          const thumbnailBlob = await generateVideoThumbnail(file);
          const thumbnailUrl = URL.createObjectURL(thumbnailBlob);
          setVideoThumbnail((prev) => [
            ...prev,
            { fileName: file.name, thumbnailUrl },
          ]);
        } catch (error) {
          console.error("Error creating video thumbnails:", error);
        }
      }

      setSortedVideos(newVideos);
      setModalOpen(true);
    } catch (error) {
      console.error("Upload error:", error);
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
