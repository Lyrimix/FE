import React, { useEffect, useState } from "react";
import SidebarGroup from "../../molecules/sidebar-mols/SidebarGroup";
import { useVideoContext } from "../../utils/context/VideoContext";
import {
  intergrateLyricToVideo,
  getLyricById,
  showHideLyrics,
  updateLyricByProjectId,
  uploadToCloudinary,
  updateProject,
  applyTransition,
} from "../../apis/ProjectApi";
import SidebarOptions from "./SidebarOptions";
import EditLyric from "../../organisms/sidebar/EditLyric";
import "./Sidebar.css";
import { SIDEBAR_ITEMS, TABS } from "../../utils/constant";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { useLoadingStore } from "../../store/useLoadingStore";
import { fetchVideoBlob, convertBase64ToBlob } from "../../utils/file";
import CustomLyrics from "./CustomLyrics";
import EffectVideo from "../../organisms/sidebar/EffectVideo";

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [isSidebarOptionsOpen, setIsSidebarOptionsOpen] = useState(false);
  const [isEditLyricOpen, setIsEditLyricOpen] = useState(false);
  const { selectedFiles, setSelectedBackground, projectVideo } =
    useVideoContext();
  const [isCustomLyricOpen, setIsCustomLyricOpen] = useState(false);
  const [offcanvasType, setOffcanvasType] = useState(null);
  const { videoFile, setVideoBlob, projectInfo } = useProjectContext();
  const [customLyrics, setCustomLyrics] = useState(null);
  const [effectVideo, setIsEffectVideo] = useState(null);
  const [isEffectVideoOpen, setIsEffectVideoOpen] = useState(false);
  const [lyricEdit, setLyricEdit] = useState(null);
  const [lyric, setLyric] = useState(null);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [showHideLabel, setShowHideLabel] = useState(TABS.HIDDENLYRICS);
  const [selectedEffect, setSelectedEffect] = useState();
  const [sliderValue, setSliderValue] = useState(0);

  const onToggle = (tab) => {
    setSelectedTab(tab);
    if (tab != TABS.EFFECT) {
      setIsSidebarOptionsOpen(true);
    } else {
      setIsEffectVideoOpen(true);
      const videoMap = new Map();
      selectedFiles.forEach((file, index) => {
        const videoId = index + 1;
        videoMap.set(videoId, file.url);
      });
    }
  };

  const handleSampleImageClick = (img) => {
    setIsSidebarOptionsOpen(false);
    if (!selectedFiles.length) {
      alert("No files have been selected");
      return;
    }
    setSelectedBackground(img);
  };

  const openEffectVideo = async () => {
    setOffcanvasType(TABS.EFFECT);
  };

  const handleOptionClick = async (item) => {
    if (selectedTab == TABS.EFFECT) {
      openEffectVideo();
    }
    if (selectedTab !== TABS.LYRIC) {
      return;
    }

    try {
      switch (item) {
        case TABS.CREATELYRICAUTOMATICALLY:
          setIsSidebarOptionsOpen(false);
          await processAutomaticLyrics();
          break;

        case TABS.EDITLYRICMANUALLY:
          setIsSidebarOptionsOpen(false);
          setIsEditLyricOpen(true);
          await openLyricEditor();
          break;

        case TABS.HIDDENLYRICS:
          await toggleLyricsVisibility();
          break;

        default:
          console.warn("Unhandled option:", item);
      }
      if (item === TABS.CUSTOMLYRIC) {
        setIsSidebarOptionsOpen(false);
        setIsCustomLyricOpen(true);

        try {
          const response = await getLyricById(projectInfo.id);
          setLyricEdit(response.data || "");
        } catch (error) {
          console.error("Error while getting lyrics", error);
          setLyricEdit("");
        }
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
      const videoBlob = await fetchVideoBlob(response.data.videoUrl);
      setVideoBlob(URL.createObjectURL(videoBlob));
      const cloudinaryUrl = await uploadToCloudinary(videoBlob);
      projectInfo.asset = cloudinaryUrl;
      updateProject(projectInfo);
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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEffectClick = async (selectedEffect, sliderValue) => {
    if (!projectInfo.videos || projectInfo.videos.length < 2) {
      alert("Please ensure there are at least 2 videos to apply the effect.");
      return;
    }

    setIsEffectVideoOpen(false);
    setIsLoading(true);
    setSelectedEffect(selectedEffect);
    setSliderValue(sliderValue);

    try {
      const requestBody = {
        projectId: projectInfo.id,
        transitionType: selectedEffect,
        duration: sliderValue,
      };
      const response = await applyTransition(requestBody);
      const videoBlob = convertBase64ToBlob(response.data.result);
      setVideoBlob(URL.createObjectURL(videoBlob));
      const cloudinaryUrl = await uploadToCloudinary(videoBlob);
      projectInfo.asset = cloudinaryUrl;
      updateProject(projectInfo);
    } catch (error) {
      console.error("Error while add effect to video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sidebar-custom d-flex flex-column align-items-center bg-black text-white vh-100 position-fixed top-0 start-0">
      <SidebarGroup
        items={SIDEBAR_ITEMS}
        selectedTab={selectedTab}
        setSelectedTab={onToggle}
        isSidebarOptionsOpen={isSidebarOptionsOpen}
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
      <CustomLyrics
        isOpen={isCustomLyricOpen}
        toggle={() => setIsCustomLyricOpen(false)}
        lyric={lyricEdit || ""}
        setCustomLyrics={setCustomLyrics}
        handleSaveLyric={handleSaveLyric}
      />
      <EffectVideo
        projectInfo={projectInfo}
        isOpen={isEffectVideoOpen}
        toggle={() => setIsEffectVideoOpen(false)}
        lyric={lyricEdit || ""}
        setIsEffectVideo={setIsEffectVideo}
        handleEffectClick={handleEffectClick}
      />
    </div>
  );
};

export default Sidebar;
