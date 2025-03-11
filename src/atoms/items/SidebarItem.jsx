import React from "react";
import IconButton from "../buttons/IconButton";
import "./SidebarItem.css";

const SidebarItem = ({ icon, label, isSelected, onClick }) => {
  return (
    <div
      className={`sidebar__item ${isSelected ? "active" : ""}`}
      onClick={onClick}
    >
      <IconButton icon={icon} label={label} />
    </div>
  );
};

export default SidebarItem;
