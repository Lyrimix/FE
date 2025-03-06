import React from "react";
import { SelectField } from "../../atoms/inputs/SelectField";

export const ExportOptions = () => {
  return (
    <div>
      <SelectField
        options={["Format", "mp4", "avi"]}
        className="input-field mb-2"
      />
    </div>
  );
};
