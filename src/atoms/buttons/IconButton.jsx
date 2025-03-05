import React from "react";
import "./IconButton.css";

const IconButton = ({ icon, label, onClick }) => {
  return (
    <button className="icon-button" onClick={onClick}>
      {icon}
      <span className="icon-button__tooltip">{label}</span>
    </button>
  );
};

export default IconButton;
