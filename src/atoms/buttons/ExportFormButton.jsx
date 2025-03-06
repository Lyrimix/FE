import React from "react";

export const ExportFormButton = ({ onClick, className, children }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};
