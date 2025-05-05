import React, { useEffect, useState } from "react";
import { FaPlus, FaGoogleDrive, FaDropbox } from "react-icons/fa";
import { useFileUpload } from "../../../hooks/useFileUpload";
import VideoMerger from "./VideoMerger";
import "./VideoSection.css";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import VideoSorterModal from "./VideoSorter";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { useLoadingStore } from "../../../store/useLoadingStore";
import {
  createNewProject,
  prepareFormData,
  updateProjectInfo,
  prepareVideoRequestList,
  addAllVideosToProject,
  uploadToCloudinary,
} from "../../../utils/project";
import { useSaveContext } from "../../../utils/context/SaveContext";

export const VideoSection = () => {
  const { uploadFiles, isUploading } = useFileUpload();
  const { selectedFiles, setSelectedFiles, previewUrls, setPreviewUrls } =
    useVideoContext();
  const {
    projectInfo,
    setProjectInfo,
    projectLength,
    setProjectLength,
    projectVideosID,
    setProjectVideosId,
    videoThumbnail,
    setVideoThumbnail,
    setVideosId,
  } = useProjectContext();
  const { setShowSaveButton } = useSaveContext();

  const [mergedFiles, setMergedFiles] = useState(selectedFiles);

  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [modalOpen, setModalOpen] = useState(false);

  const [sortedVideos, setSortedVideos] = useState([]);

  const handleConfirmUpload = async (sortedVideos) => {
    setSelectedFiles((prev) => [...prev, ...sortedVideos]);
    setPreviewUrls(sortedVideos[sortedVideos.length - 1].url);
    toggleModal();
    setIsLoading(true);
    const projectId =
      projectInfo?.id ??
      (await createNewProject(setProjectInfo, projectLength));
    if (!projectId) {
      return;
    }

    try {
      setIsLoading(true);
      const files = sortedVideos.map((video) => video.file);
      const cloudinaryUrls = await uploadToCloudinary(files);

      const { totalLength } = await prepareFormData(sortedVideos, projectId);

      const videoRequestList = prepareVideoRequestList(cloudinaryUrls);
      const addedVideos = await addAllVideosToProject(
        projectId,
        videoRequestList,
        setProjectVideosId
      );
      setVideosId(addedVideos.data.result.map((video) => video.id));
      if (!addedVideos?.data?.result) {
        throw new Error("Invalid background upload response");
      }

      const projectVideoIds = addedVideos.data.result.map((item) => item.asset);
      setProjectVideosId(projectVideoIds);

      updateProjectInfo(
        addedVideos.data.result,
        totalLength,
        setProjectLength,
        setProjectInfo
      );
    } catch (error) {
      console.error("Background upload failed:", error);
    } finally {
      setIsLoading(false);
      setShowSaveButton(true);
    }
  };

  const toggleModal = () => setModalOpen((prev) => !prev);
  const triggerFileInput = () => {
    document.getElementById("video-section__file-input").click();
  };

  useEffect(() => {
    setMergedFiles([...selectedFiles]);
  }, [selectedFiles]);

  return (
    <div className="bg-custom-green d-flex flex-column justify-content-center align-items-center w-100 h-100">
      <input
        type="file"
        id="video-section__file-input"
        accept="video/mp4"
        multiple
        className="d-none"
        onChange={(event) =>
          uploadFiles(event, setVideoThumbnail, setSortedVideos, setModalOpen)
        }
      />
      <div className="p-4">
        <VideoSorterModal
          isOpen={modalOpen}
          toggle={toggleModal}
          videos={sortedVideos}
          setVideos={setSortedVideos}
          videoThumbnail={videoThumbnail}
          onConfirmUpload={handleConfirmUpload}
        />
      </div>

      {!selectedFiles.length ? (
        <div className="w-25 ms-5 d-flex flex-column align-items-center p-4 bg-white rounded-5  shadow text-center">
          <div
            className="cursor-pointer bg-info w-30 text-white p-3 rounded-4 d-flex align-items-center justify-content-center mb-2"
            onClick={triggerFileInput}
          >
            <FaPlus size={30} />
          </div>
          <p className="fw-bold mb-1 fs-5">Click to upload</p>
          <p className="text-muted mb-4 fs-6">Drag and drop files here</p>
          <div className="d-flex gap-2">
            <button className="btn btn-light border">
              <FaGoogleDrive size={20} />
            </button>
            <button className="btn btn-light border">
              <FaDropbox size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-100 d-flex justify-content-center h-75">
          <div className="w-100 d-flex justify-content-center align-items-center">
            <VideoMerger
              key={mergedFiles.map((file) => file.url).join("-")}
              files={mergedFiles}
              className="w-100 h-100 rounded shadow"
            />
          </div>
        </div>
      )}
    </div>
  );
};
