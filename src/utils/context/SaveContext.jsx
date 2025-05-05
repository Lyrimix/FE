import React, { createContext, useContext, useState, useRef } from "react";

const SaveContext = createContext();

export const useSaveContext = () => {
  return useContext(SaveContext);
};

export const SaveProvider = ({ children }) => {
  const hasClickedSaveRef = useRef(false);
  const prevEditorDataRef = useRef({});
  const [shouldUpdateProject, setShouldUpdateProject] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  return (
    <SaveContext.Provider
      value={{
        hasClickedSaveRef,
        prevEditorDataRef,
        shouldUpdateProject,
        setShouldUpdateProject,
        showSaveButton,
        setShowSaveButton,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};
