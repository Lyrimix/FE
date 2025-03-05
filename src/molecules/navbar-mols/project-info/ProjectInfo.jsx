import "./ProjectInfo.css";

export const ProjectInfo = ({ projectName }) => {
  return (
    <div className="d-flex w-100">
      <h1 className="fs-5 ms-custom">{projectName}</h1>
    </div>
  );
};
