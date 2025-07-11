import React, { useRef, useState } from "react";
import SidebarGroup from "../../molecules/sidebar-mols/SidebarGroup";
import { useVideoContext } from "../../utils/context/VideoContext";
import {
  intergrateLyricToVideo,
  uploadLyricFile,
  getLyricById,
  showHideLyrics,
  updateLyricByProjectId,
  uploadToCloudinary,
  updateProject,
  applyTransition,
  removeEffect,
} from "../../apis/ProjectApi";
import SidebarOptions from "../../organisms/sidebar/SidebarOptions";
import EditLyric from "../../organisms/sidebar/EditLyric";
import "./Sidebar.css";
import { SIDEBAR_ITEMS, TABS } from "../../utils/constant";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { useLoadingStore } from "../../store/useLoadingStore";
import { fetchVideoBlob, convertBase64ToBlob } from "../../utils/file";
import CustomLyrics from "./CustomLyrics";
import EffectVideo from "../../organisms/sidebar/EffectVideo";
import { useSaveContext } from "../../utils/context/SaveContext";
import { addBackgroundToSingleVideo } from "../../apis/ProjectApi";
import { useEffect } from "react";
import { ConstantColorFactor } from "three";

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [isSidebarOptionsOpen, setIsSidebarOptionsOpen] = useState(false);
  const [isEditLyricOpen, setIsEditLyricOpen] = useState(false);
  const {
    selectedFiles,
    selectedBackground,
    setSelectedBackground,
    projectVideo,
    setProjectVideo,
    setIsShowRemoveBgButton,
    isRemoveBackground,
  } = useVideoContext();
  const { hasClickedSaveRef, prevEditorDataRef, setShouldUpdateProject } =
    useSaveContext();
  const [isCustomLyricOpen, setIsCustomLyricOpen] = useState(false);
  const [offcanvasType, setOffcanvasType] = useState(null);
  const {
    videoFile,
    setVideoBlob,
    projectInfo,
    originalProject,
    setIsDemoCutting,
    setProjectVideosId,
    projectVideosID,
    videosId,
    currentClickedVideo,
    videoUrlsWithBackground,
    setVideoUrlsWithBackground,
    isEffect,
    setIsEffect,
    setProjectInfo,
    setVideoWithBackgroundThumbnail,
    selectedTranslateLang,
  } = useProjectContext();
  const [customLyrics, setCustomLyrics] = useState(null);
  const [effectVideo, setIsEffectVideo] = useState(null);
  const [isEffectVideoOpen, setIsEffectVideoOpen] = useState(false);
  const [lyricEdit, setLyricEdit] = useState(null);
  const [lyric, setLyric] = useState(null);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [showHideLabel, setShowHideLabel] = useState(TABS.HIDDENLYRICS);
  const [selectedEffect, setSelectedEffect] = useState();
  const [sliderValue, setSliderValue] = useState(0);
  const originalVideoUrlRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const fileInputRef = useRef(null);
  const onToggle = (tab) => {
    setSelectedTab(tab);
    if (tab != TABS.EFFECT) {
      setIsSidebarOptionsOpen(true);
    } else {
      setIsEffectVideoOpen(true);
      setIsSidebarOptionsOpen(false);

      const videoMap = new Map();
      selectedFiles.forEach((file, index) => {
        const videoId = index + 1;
        videoMap.set(videoId, file.url);
      });
    }
  };
  useEffect(() => {
    console.log("videoUrlsWithBackground:", videoUrlsWithBackground);
  }, [videoUrlsWithBackground]);

  const handleSampleImageClick = async (img) => {
    setIsSidebarOptionsOpen(false);
    setIsLoading(true);
    if (!selectedFiles.length) {
      alert("No files have been selected");
      return;
    }
    let adddedBackgroundVideoUrl;
    if (videoUrlsWithBackground[currentClickedVideo] == null) {
      adddedBackgroundVideoUrl = await addBackgroundToSingleVideo(
        projectVideosID[currentClickedVideo],
        img,
        videosId[currentClickedVideo]
      );
    } else {
      adddedBackgroundVideoUrl = await addBackgroundToSingleVideo(
        videoUrlsWithBackground[currentClickedVideo],
        img,
        videosId[currentClickedVideo]
      );
    }

    setProjectVideosId((prev) => {
      const updated = [...prev];
      updated[currentClickedVideo] = adddedBackgroundVideoUrl.data.result.asset;
      return updated;
    });
    setVideoUrlsWithBackground((prev) => {
      const updated = [...prev];

      // Nếu mảng chưa đủ dài, bổ sung thêm phần tử null vào các index còn thiếu
      if (updated.length <= currentClickedVideo) {
        // Tạo thêm các phần tử null cho các vị trí chưa có
        while (updated.length <= currentClickedVideo) {
          updated.push(null);
        }
      }

      // Cập nhật giá trị tại vị trí currentClickedVideo
      updated[currentClickedVideo] =
        adddedBackgroundVideoUrl.data.result.assetWithBackground;
      setSelectedBackground(updated[0]);

      return updated;
    });

    setVideoWithBackgroundThumbnail((prev) => {
      const updated = [...prev];

      updated[currentClickedVideo] = img;
      return updated;
    });

    setShouldUpdateProject((prev) => !prev);
    setIsDemoCutting(false);
    setIsShowRemoveBgButton(true);
    setIsLoading(false);

    // if (isEffect) {
    //   await handleEffectClick(selectedEffect, sliderValue, true);
    // }
  };
  const prevRef = useRef({
    hadBg: false,
    bg: null,
    effect: null,
    slider: null,
  });

  useEffect(() => {
    const currentBg = videoUrlsWithBackground[currentClickedVideo];
    const hasBgNow = !!currentBg;

    const shouldRun =
      isEffect &&
      hasBgNow &&
      // Có background lần đầu
      (!prevRef.current.hadBg ||
        currentBg !== prevRef.current.bg ||
        selectedEffect !== prevRef.current.effect ||
        sliderValue !== prevRef.current.slider);

    if (shouldRun) {
      console.log("🏞️ applying effect with bg");
      prevRef.current = {
        hadBg: true,
        bg: currentBg,
        effect: selectedEffect,
        slider: sliderValue,
      };
      handleEffectClick(selectedEffect, sliderValue, true);
    } else {
      console.log("🚫 no effect re-apply");
    }
  }, [
    isEffect,
    videoUrlsWithBackground,
    currentClickedVideo,
    selectedEffect,
    sliderValue,
  ]);

  useEffect(() => {
    if (isRemoveBackground === true) {
      if (isEffect) {
        handleEffectClick(selectedEffect, sliderValue, true);
      }
    }
  }, [isRemoveBackground]);

  const handleUpdateClick = () => {
    hasClickedSaveRef.current = true;
    setIsDemoCutting(false);
    prevEditorDataRef.current = {};
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
        case TABS.UPLOADLYRIC:
          await processUploadLyric();
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

  const processUploadLyric = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- HÀM XỬ LÝ KHI NGƯỜI DÙNG CHỌN FILE ---
  const handleFileChange = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];

    if (file) {
      // 1. Kiểm tra định dạng file
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      if (
        fileExtension !== "ass" &&
        fileExtension !== "srt" &&
        fileExtension !== "vtt"
      ) {
        alert("Invalid file format. Please select \".ass\", \".srt\", or \".vtt\" file");
        console.log("fileExtension", fileExtension);

        setIsLoading(false);
        event.target.value = null;
        return;
      }
      console.log("fileExtension", fileExtension);
      const formData = createUploadLyricFormData(
        projectVideo,
        projectInfo.id,
        file,
        "." + fileExtension
      );
      const response = await uploadLyricFile(formData);
      const videoBlob = await fetchVideoBlob(response.data.videoUrl);
      setVideoBlob(URL.createObjectURL(videoBlob));
      const cloudinaryUrl = await uploadToCloudinary(videoBlob);
      projectInfo.asset = cloudinaryUrl;
      updateProject(projectInfo);
    }
    setIsLoading(false);
  };

  const processAutomaticLyrics = async () => {
    setIsLoading(true);

    try {
      const formData = createLyricFormData(
        projectVideo,
        projectInfo.id,
        selectedTranslateLang
      );
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
    console.log(toggleLyricsVisibility);
    
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

  const createLyricFormData = (file, projectId, selectedTranslateLang) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("targetLang", selectedTranslateLang);
    return formData;
  };

  const createUploadLyricFormData = (
    videoFile,
    projectId,
    lyricFile,
    format
  ) => {
    const formData = new FormData();
    formData.append("fileVideo", videoFile);
    formData.append("projectId", projectId);
    formData.append("fileLyric", lyricFile);
    formData.append("inputFormat", format);
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

  const retryApplyTransition = async (
    requestBody,
    retries = 1,
    delay = 1000
  ) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await applyTransition(requestBody);
      } catch (error) {
        if (attempt === retries) throw error;
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  };

  let isFirstTimeApply = true;

  const handleEffectClick = async (selectedEffect, sliderValue, isCallBack) => {
    if (!selectedEffect) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("projectId", projectInfo.id);
      const response = await removeEffect(formData);
      setIsEffect(false);
      await handleTransitionResponse(response, false);
      setIsLoading(false);
      return;
    }

    if (!isValidVideoCount(projectInfo?.videos)) {
      alert("At least 2 videos are required to apply a transition.");
      return;
    }

    prepareEffectState(selectedEffect, sliderValue);

    try {
      if (isFirstTimeApply) {
        await delay(500);
        isFirstTimeApply = false;
      }

      const response = await sendTransitionRequest(
        projectInfo.id,
        selectedEffect,
        sliderValue
      );
      await handleTransitionResponse(response, isCallBack);
      setIsEffect(true);
    } catch (error) {
      console.error("Transition error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidVideoCount = (videos) =>
    Array.isArray(videos) && videos.length >= 2;

  const prepareEffectState = (selectedEffect, sliderValue) => {
    setIsEffectVideoOpen(true);
    setIsLoading(true);
    setSelectedEffect(selectedEffect);
    setSelectedType(selectedEffect);
    setSliderValue(sliderValue);
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const sendTransitionRequest = (projectId, type, duration) => {
    const body = { projectId, transitionType: type, duration };
    return retryApplyTransition(body, 1, 1000);
  };

  const handleTransitionResponse = async (response, isCallBack) => {
    const videoBlob = convertBase64ToBlob(response.data.result);
    setProjectVideo(videoBlob);
    setVideoBlob(URL.createObjectURL(videoBlob));
    const newCloudinaryUrl = await uploadToCloudinary(videoBlob);
    console.log("sidebar videoUrlsWithBackground:", videoUrlsWithBackground);
    const updatedProject = {
      ...projectInfo,
      asset: newCloudinaryUrl,
      videos: projectInfo.videos.map((video, index) => {
        if (index === currentClickedVideo) {
          return {
            ...video,
            assetWithBackground: videoUrlsWithBackground[currentClickedVideo],
          };
        }
        return video;
      }),
    };

    console.log("sidebar updatedProjectInfo:", updatedProject);
    setProjectInfo(updatedProject);
    updateProject(updatedProject);

    // handleUpdateClick();
  };

  return (
    <div className="sidebar-custom d-flex flex-column align-items-center vh-100 position-fixed top-0 start-0">
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
        z
      />
      <EditLyric
        isOpen={isEditLyricOpen}
        toggle={() => setIsEditLyricOpen(false)}
        lyric={lyricEdit || ""}
        setLyricEdit={setLyricEdit}
        handleSaveLyric={handleSaveLyric}
        onRefreshLyric={openLyricEditor}
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
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        hasClickedSaveRef={hasClickedSaveRef}
      />
      {/* INPUT FILE ẨN CHO LYRIC - Đặt ở đây để nó luôn trong DOM */}
      <input
        type="file"
        accept=".ass"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Sidebar;
