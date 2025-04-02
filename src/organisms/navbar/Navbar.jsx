import "./Navbar.css";
import { ProjectInfo } from "../../Molecules/Navbar-Mols/project-info/ProjectInfo";
import { PROJECT_NAME } from "../../utils/constant";
import { UserOption } from "../../molecules/navbar-mols/user-option/UserOption";

export const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="content-name">
        <ProjectInfo projectName={PROJECT_NAME}></ProjectInfo>
      </div>

      <div className="user-options">
        <UserOption></UserOption>
      </div>
    </div>
  );
};
