import React from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import { FiUpload } from "react-icons/fi";
import { BACKGROUND_IMAGES, EXPANDED_ITEMS, TABS } from "../../utils/constant";

const SidebarOptions = ({
  isOpen,
  toggle,
  selectedTab,
  handleOptionClick,
  handleSampleImageClick,
}) => {
  return (
    <Offcanvas isOpen={isOpen} toggle={toggle} direction="start">
      <OffcanvasHeader toggle={toggle} className="bg-dark text-white">
        Options
      </OffcanvasHeader>
      <OffcanvasBody className="bg-light">
        {selectedTab === TABS.BACKGROUND ? (
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
  );
};

export default SidebarOptions;
