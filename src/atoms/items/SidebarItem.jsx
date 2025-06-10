import React from "react";
import IconButton from "../buttons/IconButton";

const SidebarItem = ({ icon, label, isSelected, onClick }) => {
  return (
    <div
      className={`sidebar__item ${isSelected ? "active" : ""}`}
      onClick={onClick}
    >
      <IconButton icon={icon} label={label} isSelected={isSelected} />
    </div>
  );
};

export default SidebarItem;
