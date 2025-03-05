import React from "react";
import "./InputField.css";

export const InputField = ({ placeholder, className }) => {
  return <input type="text" placeholder={placeholder} className={className} />;
};
