import React from "react";
import SidebarItem from "../../atoms/items/SidebarItem";
import "./SidebarGroup.css";
const SidebarGroup = ({
  items,
  selectedTab,
  setSelectedTab,
  isSidebarOptionsOpen,
}) => {
  return (
    <div
      className={`sidebar-group ${isSidebarOptionsOpen ? "with-border" : ""}`}
    >
      {items.map((item, index) => (
        <SidebarItem
          key={index}
          icon={item.icon}
          label={item.label}
          isSelected={selectedTab === item.label}
          onClick={() => setSelectedTab(item.label)}
        />
      ))}
    </div>
  );
};

export default SidebarGroup;
