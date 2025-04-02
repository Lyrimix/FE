import React from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import { FiUpload } from "react-icons/fi";
import { BACKGROUND_IMAGES, EXPANDED_ITEMS, TABS } from "../../utils/constant";
import "./SidebarOptions.css";
import { FiX } from "react-icons/fi";
const SidebarOptions = ({
  isOpen,
  toggle,
  selectedTab,
  handleOptionClick,
  showHideLabel,
  handleSampleImageClick,
}) => {
  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      backdrop={false}
      direction="start"
      style={{ width: "200px", left: "90px" }}
    >
      <OffcanvasHeader className="bg-black text-white custom-border-bottom">
        Options
        <button className="custom-close-btn" onClick={toggle}>
          <FiX />
        </button>
      </OffcanvasHeader>
      <OffcanvasBody className="bg-black canvas-body">
        {selectedTab === TABS.BACKGROUND ? (
          <div className="d-flex flex-column align-items-center">
            <button className="bg-dark btn btn-secondary w-100 mb-3 d-flex align-items-center justify-content-center gap-2">
              <FiUpload /> Upload
            </button>
            <div className="">
              {BACKGROUND_IMAGES.map((src, index) => (
                <div key={index} className="mb-3">
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
                className="w-100 border border-light mb-1"
                onClick={() => handleOptionClick(item)}
              >
                {item === TABS.HIDDENLYRICS ? showHideLabel : item}
              </Button>
            ))}
          </div>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default SidebarOptions;
