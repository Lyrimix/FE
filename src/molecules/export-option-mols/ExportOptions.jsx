import React from "react";
import { SelectField } from "../../atoms/inputs/SelectField";
import { useProjectContext } from "../../utils/context/ProjectContext";

export const ExportOptions = ({ options }) => {
  const { setProjectRatio } = useProjectContext();

  const handleChange = (event) => {
    setProjectRatio(event.target.value);
  };

  return (
    <div>
      <SelectField
        options={options}
        className="input-field h-100"
        onChange={handleChange}
      />
    </div>
  );
};
