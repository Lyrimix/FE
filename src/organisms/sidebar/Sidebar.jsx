import React, { useState } from "react";
import SidebarGroup from "../../Molecules/sidebar-mols/SidebarGroup";
import { useVideoContext } from "../../utils/context/VideoContext";
import { useProjectContext } from "../../utils/context/ProjectContext";
import {
  intergrateLyricToVideo,
  getLyricById,
  updateLyricByProjectId,
} from "../../apis/ProjectApi";
import SidebarOptions from "./SidebarOptions";
import EditLyric from "./EditLyric";
import "./Sidebar.css";
import { SIDEBAR_ITEMS, TABS } from "../../utils/constant";

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [offcanvasType, setOffcanvasType] = useState(null);
  const { selectedFiles, setSelectedBackground } = useVideoContext();
  const { videoFile, setVideoBlob, projectInfo } = useProjectContext();
  const [lyric, setLyric] = useState(null);
  const [lyricEdit, setLyricEdit] = useState(null);

  const onToggle = (tab) => {
    setSelectedTab(tab);
    setOffcanvasType(TABS.OPTIONS);
  };

  const handleSampleImageClick = (img) => {
    if (selectedFiles.length === 0) {
      alert("No files have been selected");
      return;
    }
    setSelectedBackground(img);
  };

  const handleOptionClick = async (item) => {
    if (selectedTab === TABS.LYRIC && item === TABS.CREATELYRICAUTOMATICALLY) {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("projectId", projectInfo.id);
      try {
        const response = await intergrateLyricToVideo(formData);
        const videoResponse = await fetch(response.data.videoUrl);
        const videoBlob = await videoResponse.blob();
        setVideoBlob(URL.createObjectURL(videoBlob));
      } catch (error) {
        console.error("Error while integrating Lyrics:", error);
      }
    }

    if (selectedTab === TABS.LYRIC && item === TABS.EDITLYRICMANUALLY) {
      setOffcanvasType(TABS.EDITLYRIC);
      try {
        const response = await getLyricById(projectInfo.id);
        setLyric(response.data);
        setLyricEdit(response.data);
      } catch (error) {
        console.error("Error fetching lyric:", error);
      }
    }
  };

  const handleSaveLyric = async () => {
    setOffcanvasType(null);
    try {
      if (lyricEdit !== lyric) {
        const formData = new FormData();
        formData.append("text", lyricEdit);
        formData.append("projectId", projectInfo.id);
        formData.append("file", videoFile);
        const response = await updateLyricByProjectId(formData);
        const videoResponse = await fetch(response.data.videoUrl);
        const videoBlob = await videoResponse.blob();
        setVideoBlob(URL.createObjectURL(videoBlob));
      }
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
        isOpen={offcanvasType === TABS.OPTIONS}
        toggle={() => setOffcanvasType(null)}
        selectedTab={selectedTab}
        handleOptionClick={handleOptionClick}
        handleSampleImageClick={handleSampleImageClick}
      />

      <EditLyric
        isOpen={offcanvasType === TABS.EDITLYRIC}
        toggle={() => setOffcanvasType(null)}
        lyricEdit={lyricEdit}
        setLyricEdit={setLyricEdit}
        handleSaveLyric={handleSaveLyric}
      />
    </div>
  );
};

export default Sidebar;
