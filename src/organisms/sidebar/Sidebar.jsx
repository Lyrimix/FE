import React, { useState } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import SidebarGroup from "../../Molecules/sidebar-mols/SidebarGroup";
import { FiUpload } from "react-icons/fi";
import { useVideoContext } from "../../utils/context/VideoContext";
import { intergrateLyricToVide } from "../../apis/ProjectApi";
import {
  SIDEBAR_ITEMS,
  BACKGROUND_IMAGES,
  EXPANDED_ITEMS,
} from "../../utils/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { useProjectContext } from "../../utils/context/ProjectContext";

const Sidebar = () => {
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const { selectedFiles, setSelectedBackground } = useVideoContext();
  const { videoFile, setVideoBlob } = useProjectContext();

  const onToggle = (tab) => {
    if (selectedTab !== tab || !offcanvasOpen) {
      setSelectedTab(tab);
    }
    setOffcanvasOpen((prev) => !prev);
  };

  const handleSampleImageClick = (img) => {
    if (selectedFiles.length === 0) {
      alert("No files have been selected");
      return;
    }
    setSelectedBackground(img);
  };

  const handleOptionClick = async (item) => {
    if (selectedTab === "Lyric" && item === "Create lyric automatically") {
      const formData = new FormData();
      formData.append("file", videoFile);
      try {
        const response = await intergrateLyricToVide(formData);
        const videoResponse = await fetch(response.data.videoUrl);
        const videoBlob = await videoResponse.blob();
        setVideoBlob(URL.createObjectURL(videoBlob));
      } catch (error) {
        console.error("Error while intergrating Lyrics:" + error);
      }
    }
  };

  return (
    <div className="sidebar-custom d-flex flex-column align-items-center bg-black text-white vh-100 position-fixed top-0 start-0">
      <SidebarGroup
        items={SIDEBAR_ITEMS}
        selectedTab={selectedTab}
        setSelectedTab={onToggle}
      />

      <Offcanvas
        isOpen={offcanvasOpen}
        toggle={() => setOffcanvasOpen(false)}
        direction="start"
      >
        <OffcanvasHeader
          toggle={() => setOffcanvasOpen(false)}
          className="bg-dark text-white"
        >
          Options
        </OffcanvasHeader>
        <OffcanvasBody className="bg-light">
          {selectedTab === "Background" ? (
            <div className="d-flex flex-column align-items-center">
              <button className="btn btn-secondary w-50 mb-3 d-flex align-items-center justify-content-center gap-2">
                <FiUpload /> Upload
              </button>
              <div className="row g-2">
                {BACKGROUND_IMAGES.map((src, index) => (
                  <div key={index} className="col-6">
                    <img
                      src={src}
                      crossOrigin="anonymous"
                      alt={`Background ${index}`}
                      className="img-fluid rounded shadow-sm"
                      onClick={() => handleSampleImageClick(src)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="d-grid gap-2">
              {EXPANDED_ITEMS[selectedTab]?.map((item, index) => (
                <Button
                  key={index}
                  color="dark"
                  className="w-100"
                  onClick={() => handleOptionClick(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          )}
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
};

export default Sidebar;
