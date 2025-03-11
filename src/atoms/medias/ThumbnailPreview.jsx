import React from "react";

export const ThumbnailPreview = ({ src, alt, className }) => {
  return (
    <img
      crossOrigin="anonymous"
      src={src}
      alt={alt}
      className={className}
      style={{ width: "100%", height: "110px", objectFit: "cover" }}
    />
  );
};
