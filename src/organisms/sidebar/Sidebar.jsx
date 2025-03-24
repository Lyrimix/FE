import React, { useState } from "react";
import SidebarGroup from "../../Molecules/sidebar-mols/SidebarGroup";
import { useVideoContext } from "../../utils/context/VideoContext";
import {
  intergrateLyricToVideo,
  getLyricById,
  updateLyricByProjectId,
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
    if (selectedTab !== TABS.LYRIC) return;

    try {
      if (item === TABS.CREATELYRICAUTOMATICALLY) {
        setIsSidebarOptionsOpen(false);
        const responseLyric = await getLyricById(projectInfo.id);
        if (responseLyric.data.length !== 0) return;

        const formData = new FormData();
        formData.append("file", projectVideo);
        formData.append("projectId", projectInfo.id);

        const response = await intergrateLyricToVideo(formData);
        const videoBlob = await fetchVideoBlob(response.data.videoUrl);
        setVideoBlob(URL.createObjectURL(videoBlob));
      }

      if (item === TABS.EDITLYRICMANUALLY) {
        setIsSidebarOptionsOpen(false);
        setIsEditLyricOpen(true);

        try {
          const response = await getLyricById(projectInfo.id);
          setLyricEdit(response.data || "");
        } catch (error) {
          console.error("Error while getting lyrics", error);
          setLyricEdit("");
        }
      }
    } catch (error) {
      console.error("Error handling lyric action:", error);
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
