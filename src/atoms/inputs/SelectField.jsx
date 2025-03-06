import React from "react";
import { Input } from "reactstrap";

export const SelectField = ({ options, className }) => {
  return (
    <Input type="select" className={className}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </Input>
  );
};
