import React from "react";
import "bootstrap/dist/css/bootstrap.css";

export const ActionItem = ({
  action,
  hoveredAction,
  setHoveredAction,
  handleDelete,
}) => {
  return (
    <div
      className="position-relative w-100 h-100 rounded"
      x
      onMouseEnter={() => setHoveredAction(action.id)}
      onMouseLeave={() => setHoveredAction(null)}
    >
      <img
        src={
          "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-5.jpg"
        }
        crossOrigin="anonymous"
        className="w-100 h-100 object-fit-cover mb-5"
        alt="Thumbnail"
      />
      {hoveredAction === action.id && (
        <button
          className="position-absolute start-50 top-50 translate-middle
          mt-1 me-1 bg-danger text-white border-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
          style={{ width: "20px", height: "20px" }}
          onClick={() => handleDelete(action.id)}
        >
          ×
        </button>
      )}
    </div>
  );
};
