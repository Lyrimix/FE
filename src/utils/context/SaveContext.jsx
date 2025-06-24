import React, { createContext, useContext, useState, useRef } from "react";

const SaveContext = createContext();

export const useSaveContext = () => {
  return useContext(SaveContext);
};
export const defaultSaveState = {
  shouldUpdateProject: false,
  showSaveButton: false,
};
export const SaveProvider = ({ children }) => {
  const hasClickedSaveRef = useRef(false);
  const prevEditorDataRef = useRef({});

  const [shouldUpdateProject, setShouldUpdateProject] = useState(
    defaultSaveState.shouldUpdateProject
  );
  const [showSaveButton, setShowSaveButton] = useState(
    defaultSaveState.showSaveButton
  );
  const setters = {
    shouldUpdateProject: setShouldUpdateProject,
    showSaveButton: setShowSaveButton,
  };

  const resetSaveContext = () => {
    Object.entries(defaultSaveState).forEach(([key, value]) => {
      if (setters[key]) setters[key](value);
    });
    hasClickedSaveRef.current = false;
    prevEditorDataRef.current = {};
  };

  return (
    <SaveContext.Provider
      value={{
        hasClickedSaveRef,
        prevEditorDataRef,
        shouldUpdateProject,
        setShouldUpdateProject,
        showSaveButton,
        setShowSaveButton,
        resetSaveContext,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};
