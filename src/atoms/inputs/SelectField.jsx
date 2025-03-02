import React from "react";

export const SelectField = ({ options, className }) => {
  return (
    <select className={`select-field ${className}`}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
