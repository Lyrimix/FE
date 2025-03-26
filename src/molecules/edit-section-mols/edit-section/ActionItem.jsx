import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import IconButton from "../../../atoms/buttons/IconButton";
import { FaTrash } from "react-icons/fa";

export const ActionItem = ({
  action,
  hoveredAction,
  setHoveredAction,
  handleDelete,
}) => {
  return (
    <div
      className="position-relative w-100 h-100 rounded"
      onMouseEnter={() => setHoveredAction(action.id)}
      onMouseLeave={() => setHoveredAction(null)}
    >
      {/* <img
        src={
          "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-5.jpg"
        }
        crossOrigin="anonymous"
        className="w-100 h-100 object-fit-cover mb-5"
        alt="Thumbnail"
      /> */}
      {/* {hoveredAction === action.id && (
        <IconButton
          icon={<FaTrash size={22} />}
          label=""
          onClick={() => handleDelete(action.id)}
          className="position-absolute start-50 top-50 translate-middle 
                  mt-1 me-1 bg-danger text-white border-0 rounded-circle 
                  p-10 d-flex align-items-center justify-content-center"
        />
      )} */}
    </div>
  );
};
