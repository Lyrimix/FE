import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import IconButton from "../../../atoms/buttons/IconButton";
import { FaTrash } from "react-icons/fa";
import { COPY_SUFFIX } from "../../../utils/constant";

export const ActionItem = ({
  action,

  handleDelete,
  thumbnail,
  style,
}) => {
  const isCopy = action.id.includes(COPY_SUFFIX);

  return (
    <div style={style} className="position-relative w-100 h-100 rounded ">
      <img
        src={thumbnail}
        crossOrigin="anonymous"
        className={`w-100 h-100 object-fit-cover mb-5 bg-white ${
          isCopy ? "opacity-50" : ""
        }`}
        alt="Thumbnail"
      />
    </div>
  );
};
