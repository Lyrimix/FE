import React from "react";
import { NavbarComponent } from "../../Organisms/navbar/Navbar";
import { MainContent } from "../../Organisms/main-content/MainContent";
import Sidebar from "../../Organisms/sidebar/Sidebar";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <div className="home-page">
      <NavbarComponent className="home-page__navbar"></NavbarComponent>
      <div className="home-page__body">
        <Sidebar className="home-page__sidebar"></Sidebar>
        <MainContent className="home-page__main-content"> </MainContent>
      </div>
    </div>
  );
};
