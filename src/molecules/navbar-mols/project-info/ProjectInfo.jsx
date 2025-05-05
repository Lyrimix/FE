import "./ProjectInfo.css";
import GradientText from "../../../atoms/buttons/GradientText";

export const ProjectInfo = ({ projectName }) => {
  return (
    <div className="d-flex w-100">
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={3}
        showBorder={false}
        className="custom-class"
      >
        <h1 className="fs-4 ms-custom">{projectName}</h1>
      </GradientText>
    </div>
  );
};
