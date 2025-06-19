import React from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import { FiUpload } from "react-icons/fi";
import { BACKGROUND_IMAGES, EXPANDED_ITEMS, TABS } from "../../utils/constant";
import { uploadImageToCloudinary } from "../../apis/ProjectApi";
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
  const fileInputRef = React.useRef(null);

  // Handler to trigger file input click
  const onUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler for file input change
  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Upload image to cloud and get URL
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (uploadedUrl) {
        handleSampleImageClick(uploadedUrl);
      }
      // Reset the input value to allow re-uploading the same file if needed
      event.target.value = null;
    }
  };

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      backdrop={false}
      direction="start"
      style={{ width: "200px", left: "90px" }}
    >
      <OffcanvasHeader className="custom-border-bottom">
        <span>Options</span>
        <button className="custom-close-btn" onClick={toggle}>
          <FiX />
        </button>
      </OffcanvasHeader>
      <OffcanvasBody className="canvas-body">
        {selectedTab === TABS.BACKGROUND ? (
          <div className="d-flex flex-column align-items-center">
            <button
              className="button-upload  w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
              onClick={onUploadButtonClick}
            >
              <FiUpload /> Upload
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={onFileChange}
            />
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
              <button
                key={index}
                // color="dark"
                className="option-btn w-100 mb-1"
                onClick={() => handleOptionClick(item)}
              >
                {item === TABS.HIDDENLYRICS ? showHideLabel : item}
              </button>
            ))}
          </div>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default SidebarOptions;
