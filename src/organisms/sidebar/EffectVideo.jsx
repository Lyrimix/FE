import React, { useState } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import { useLoadingStore } from "../../store/useLoadingStore";
import { Slider } from "@mui/material";
import VideoPreview from "../../utils/VideoPreview";
import { EFFECT_GROUPS, SLIDER_VALUE } from "../../utils/constant";

import "./EffectVideo.css";

const EffectVideo = ({
  isOpen,
  toggle,
  handleEffectClick,
  selectedType,
  setSelectedType,
  handleUpdateClick,
}) => {
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [sliderValue, setSliderValue] = useState(SLIDER_VALUE);

  const handleClick = (type) => {
    if (selectedType === type) {
      setSelectedType(null);
      handleEffectClick(null, sliderValue);
    } else {
      setSelectedType(type);
      handleEffectClick(type, sliderValue);
    }
  };

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="end"
      backdrop={false}
      className="custom-offcanvas"
    >
      <OffcanvasHeader toggle={toggle} className="px-3 py-3 bg-dark text-light">
        <div className="px-3 py-2">Effect Videos</div>
      </OffcanvasHeader>
      <OffcanvasBody className="bg-black">
        <div className="container w-100 p-0" style={{ overflowY: "auto" }}>
          <div className="p-3">
            <div className="row g-2">
              {EFFECT_GROUPS.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-2">
                  <h5 className="group-name text-light mb-3">{group.name}</h5>
                  <div className="row g-2">
                    {group.effects.map(
                      ({ video, type_request, type }, index) => (
                        <div key={index} className="col-3">
                          <VideoPreview
                            src={video}
                            onClick={() => handleClick(type_request)}
                            isSelected={selectedType === type_request}
                            onDeselect={() => {
                              setSelectedType(null);
                              handleEffectClick(null, sliderValue);
                            }}
                          />
                          <p className="effect-label mt-2 text-light text-capitalize text-center text-sm">
                            {type.replace(/[-_]/g, " ")}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="duration_lable text-light p-2 rounded fw-bold text-sm">
              DURATION
            </div>
            <div className="container-slider">
              <Slider
                value={sliderValue}
                min={0}
                max={5}
                step={1}
                onChange={(e, newValue) => setSliderValue(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}s`}
              />
            </div>
          </div>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default EffectVideo;
