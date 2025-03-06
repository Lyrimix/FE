import React from "react";
import IconButton from "../buttons/IconButton";
import "./SidebarItem.css";
const SidebarItem = ({ icon, label }) => {
  return (
    <div className="sidebar__item">
      <IconButton icon={icon} label={label} />
    </div>
  );
};

export default SidebarItem;
