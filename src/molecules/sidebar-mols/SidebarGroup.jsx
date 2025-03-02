import React from "react";
import SidebarItem from "../../atoms/items/SidebarItem";

const SidebarGroup = ({ items }) => {
  return (
    <div className="sidebar__group">
      {items.map((item, index) => (
        <SidebarItem key={index} icon={item.icon} label={item.label} />
      ))}
    </div>
  );
};

export default SidebarGroup;
