import React, { useEffect, useRef } from "react";

const VideoPreview = ({ src, onClick, isSelected, onDeselect }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => console.log("Autoplay crashed:", err));
    }
  }, []);

  return (
    <div className="position-relative cursor-pointer" onClick={onClick}>
      <video
        ref={videoRef}
        src={src}
        crossOrigin="anonymous"
        className="img-fluid rounded-2 shadow-sm border"
        loop
        autoPlay
        muted
        playsInline
      ></video>

      {isSelected && (
        <>
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(11, 1, 1, 0.7)", zIndex: 10 }}
          ></div>
          <button
            className="position-absolute top-50 start-50 translate-middle btn btn-light btn-sm fw-bold z-20"
            onClick={(e) => {
              e.stopPropagation();
              onDeselect();
            }}
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
};

export default VideoPreview;
