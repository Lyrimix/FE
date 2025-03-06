import React from "react";
import SidebarItem from "../../atoms/items/SidebarItem";

const SidebarGroup = ({ items, selectedTab, setSelectedTab }) => {
  return (
    <div className="sidebar__group mt-5">
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
