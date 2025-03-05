import React, { useState } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import { SIDEBAR_ITEMS, OPTIONS } from "../../utils/constant";
import "./Sidebar.css";

const Sidebar = () => {
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

  const onToggle = () => {
    setOffcanvasOpen((prev) => !prev);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        {SIDEBAR_ITEMS.map((item, index) => (
          <div key={index} className="sidebar-item" onClick={onToggle}>
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <Offcanvas isOpen={offcanvasOpen} toggle={onToggle} direction="start">
        <OffcanvasHeader toggle={onToggle}>Options</OffcanvasHeader>
        <OffcanvasBody>
          {OPTIONS.map((option, index) => (
            <Button key={index} color="dark" block className="my-2">
              {option}
            </Button>
          ))}
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
};

export default Sidebar;
