import "./Navbar.css";
import { UserOption } from "../../Molecules/Navbar-Mols/user-option/UserOption";
import { ProjectInfo } from "../../Molecules/Navbar-Mols/project-info/ProjectInfo";
import { PROJECT_NAME } from "../../utils/constant";

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
