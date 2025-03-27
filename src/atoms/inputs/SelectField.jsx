import React from "react";
import { Input } from "reactstrap";

export const SelectField = ({ options, className, onChange = () => {} }) => {
  return (
    <Input type="select" className={className} onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </Input>
  );
};
