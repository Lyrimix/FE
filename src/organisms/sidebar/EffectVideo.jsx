import React, { useState } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import { useLoadingStore } from "../../store/useLoadingStore";
import { duration, Slider } from "@mui/material";
import VideoPreview from "../../utils/VideoPreview";
import { EFFECT_VIDEOS, SLIDER_VALUE } from "../../utils/constant";
import "./EffectVideo.css";

const EffectVideo = ({ isOpen, toggle, handleEffectClick }) => {
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [sliderValue, setSliderValue] = useState(SLIDER_VALUE);

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
            <div className="text-light p-2 rounded fw-bold">
              Crossfade Transitions
            </div>
            <div className="row g-2">
              {EFFECT_VIDEOS.map(({ video, type }, index) => (
                <div key={index} className="col-6">
                  <VideoPreview
                    src={video}
                    onClick={() => handleEffectClick(type, sliderValue)}
                  />
                  <p className="mt-2 text-light text-capitalize text-center">
                    {type}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-light p-2 rounded fw-bold">Duration</div>
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