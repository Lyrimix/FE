import React, { useEffect, useRef } from "react";

const VideoPreview = ({ src, onClick }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => console.log("Autoplay crashed:", err));
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      crossOrigin="anonymous"
      className="img-fluid rounded-0 shadow-sm border"
      onClick={onClick}
      loop
      autoPlay
      muted
      playsInline
    ></video>
  );
};

export default VideoPreview;
