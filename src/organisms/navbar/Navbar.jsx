import "./Navbar.css";
import { UserOption } from "../../molecules/navbar-mols/user-option/UserOption";
import { PROJECT_NAME } from "../../utils/constant";
import { ProjectInfo } from "../../molecules/navbar-mols/project-info/ProjectInfo";

export const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="content-name">
        <ProjectInfo projectName={PROJECT_NAME}></ProjectInfo>
      </div>

      <div className="user-options d-flex justify-content-center align-items-center">
        <UserOption></UserOption>
      </div>
    </div>
  );
};
