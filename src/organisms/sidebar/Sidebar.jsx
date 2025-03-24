import React, { useState } from "react";
import SidebarGroup from "../../Molecules/sidebar-mols/SidebarGroup";
import { useVideoContext } from "../../utils/context/VideoContext";
import {
  intergrateLyricToVideo,
  getLyricById,
  showHideLyrics,
  updateLyricByProjectId,
  uploadToCloudinary,
  updateProject,
} from "../../apis/ProjectApi";
import SidebarOptions from "./SidebarOptions";
import EditLyric from "./EditLyric";
import "./Sidebar.css";
import { SIDEBAR_ITEMS, TABS } from "../../utils/constant";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { useLoadingStore } from "../../store/useLoadingStore";
import { fetchVideoBlob, convertBase64ToBlob } from "../../utils/file";

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [isSidebarOptionsOpen, setIsSidebarOptionsOpen] = useState(false);
  const [isEditLyricOpen, setIsEditLyricOpen] = useState(false);
  const { selectedFiles, setSelectedBackground, projectVideo } =
    useVideoContext();
  const { setVideoBlob, projectInfo } = useProjectContext();
  const [lyricEdit, setLyricEdit] = useState(null);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [showHideLabel, setShowHideLabel] = useState(TABS.HIDDENLYRICS);

  const onToggle = (tab) => {
    setSelectedTab(tab);
    setIsSidebarOptionsOpen(true);
  };

  const handleSampleImageClick = (img) => {
    if (!selectedFiles.length) {
      alert("No files have been selected");
      return;
    }
    setSelectedBackground(img);
  };

  const handleOptionClick = async (item) => {
    if (selectedTab !== TABS.LYRIC) {
      return;
    }

    try {
      switch (item) {
        case TABS.CREATELYRICAUTOMATICALLY:
          await processAutomaticLyrics();
          break;

        case TABS.EDITLYRICMANUALLY:
          await openLyricEditor();
          break;

        case TABS.HIDDENLYRICS:
          await toggleLyricsVisibility();
          break;

        default:
          console.warn("Unhandled option:", item);
      }
    } catch (error) {
      console.error("Error in handleOptionClick:", error);
    }
  };

  const processAutomaticLyrics = async () => {
    setIsLoading(true);

    try {
      const formData = createLyricFormData(projectVideo, projectInfo.id);
      const response = await intergrateLyricToVideo(formData);
      await uploadVideo(response.data.videoUrl);
    } catch (error) {
      console.error("Error while integrating lyrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openLyricEditor = async () => {
    setOffcanvasType(TABS.EDITLYRIC);

    try {
      const response = await getLyricById(projectInfo.id);
      setLyric(response.data);
      setLyricEdit(response.data);
    } catch (error) {
      console.error("Error fetching lyric:", error);
    }
  };

  const toggleLyricsVisibility = async () => {
    setIsSidebarOptionsOpen(false);

    try {
      const responseLyric = await getLyricById(projectInfo.id);
      if (!responseLyric.data.length) {
        alert("You need to create lyrics before showing or hiding them.");
        return;
      }

      setIsLoading(true);

      const formData = createLyricFormData(projectVideo, projectInfo.id);
      const response = await showHideLyrics(projectInfo.id, formData);

      const isHidden = response.data.lyricHidden;
      setShowHideLabel(isHidden ? TABS.SHOWLYRICS : TABS.HIDDENLYRICS);

      formData.append("text", isHidden ? " " : response.data.text);

      await uploadVideo(response.data.videoUrl);
    } catch (error) {
      console.error("Error while toggling lyrics visibility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLyricFormData = (file, projectId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    return formData;
  };

  const uploadVideo = async (videoUrl) => {
    try {
      const videoResponse = await fetch(videoUrl);

      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video: ${videoResponse.status}`);
      }

      const videoBlob = await videoResponse.blob();
      setVideoBlob(URL.createObjectURL(videoBlob));
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const handleSaveLyric = async (updatedLyric) => {
    setIsEditLyricOpen(false);
    if (updatedLyric === lyricEdit[0]) return;

    try {
      const formData = new FormData();
      formData.append("text", updatedLyric);
      formData.append("projectId", projectInfo.id);
      formData.append("file", projectVideo);

      const response = await updateLyricByProjectId(formData);
      const videoBlob = convertBase64ToBlob(response.data.result);
      setVideoBlob(URL.createObjectURL(videoBlob));
      const cloudinaryUrl = await uploadToCloudinary(videoBlob);
      projectInfo.asset = cloudinaryUrl;
      updateProject(projectInfo);
    } catch (error) {
      console.error("Error updating lyric:", error);
    }
  };

  return (
    <div className="sidebar-custom d-flex flex-column align-items-center bg-black text-white vh-100 position-fixed top-0 start-0">
      <SidebarGroup
        items={SIDEBAR_ITEMS}
        selectedTab={selectedTab}
        setSelectedTab={onToggle}
      />

      <SidebarOptions
        isOpen={isSidebarOptionsOpen}
        toggle={() => setIsSidebarOptionsOpen(false)}
        selectedTab={selectedTab}
        handleOptionClick={handleOptionClick}
        handleSampleImageClick={handleSampleImageClick}
        showHideLabel={showHideLabel}
      />

      <EditLyric
        isOpen={isEditLyricOpen}
        toggle={() => setIsEditLyricOpen(false)}
        lyric={lyricEdit || ""}
        setLyricEdit={setLyricEdit}
        handleSaveLyric={handleSaveLyric}
      />
    </div>
  );
};

export default Sidebar;
