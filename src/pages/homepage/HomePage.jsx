import { Navbar } from "../../organisms/navbar/Navbar";
import { MainContent } from "../../organisms/main-content/MainContent";
import Sidebar from "../../organisms/sidebar/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <div className="d-flex flex-column vh-100">
      <Navbar className="w-100"></Navbar>
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar className="home-page__sidebar text-white"></Sidebar>
        <MainContent className="flex-grow-1 p-3 ms-5 overflow-auto"></MainContent>
      </div>
    </div>
  );
};
