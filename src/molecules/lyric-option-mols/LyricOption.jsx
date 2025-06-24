import React, { useEffect, useState } from "react";
import { useProjectContext } from "../../utils/context/ProjectContext";
import LanguageOptions from "./LanguageOptions";
import "./LyricOption.css";

const LyricOption = ({
  selectedTab,
  expandedItems,
  handleOptionClick,
  showHideLabel,
  TABS,
}) => {
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const { selectedTranslateLang, setSelectedTranslateLang } =
    useProjectContext();
  const [shouldRenderLanguageOptions, setShouldRenderLanguageOptions] =
    useState(showLanguageOptions);
  const [isTransitioningIn, setIsTransitioningIn] = useState(false); // <-- THÊM STATE NÀY

  useEffect(() => {
    let timeoutIdShowRender;
    let timeoutIdStartTransition;
    let timeoutIdHide;

    if (showLanguageOptions) {
      timeoutIdShowRender = setTimeout(() => {
        setShouldRenderLanguageOptions(true);
        timeoutIdStartTransition = setTimeout(() => {
          setIsTransitioningIn(true);
        }, 0);
      }, 0);
    } else {
      setIsTransitioningIn(false);
      timeoutIdHide = setTimeout(() => {
        setShouldRenderLanguageOptions(false);
      }, 300);
    }

    return () => {
      if (timeoutIdShowRender) clearTimeout(timeoutIdShowRender);
      if (timeoutIdStartTransition) clearTimeout(timeoutIdStartTransition);
      if (timeoutIdHide) clearTimeout(timeoutIdHide);
    };
  }, [showLanguageOptions]);

  if (!expandedItems || !expandedItems[selectedTab]) {
    return null;
  }

  return (
    <div className="d-grid gap-2">
      <div className="option-btn">
        <button
          className="create-btn w-100 mb-1"
          onClick={() => setShowLanguageOptions(!showLanguageOptions)}
        >
          Create lyric automatically
        </button>
        {shouldRenderLanguageOptions && (
          <div
            className={`language-options-wrapper ${
              isTransitioningIn ? "" : "hidden"
            }`}
          >
            <LanguageOptions
              selectedTranslateLang={selectedTranslateLang}
              setSelectedTranslateLang={setSelectedTranslateLang}
              setShowLanguageOptions={setShowLanguageOptions}
              handleOptionClick={handleOptionClick}
            />
          </div>
        )}
      </div>
      <button
        className="option-btn w-100 mb-1"
        onClick={() => handleOptionClick("Upload lyric file")}
      >
        Upload lyric file
      </button>
      <button
        className="option-btn w-100 mb-1"
        onClick={() => handleOptionClick("Edit lyric manually")}
      >
        Edit lyric manually
      </button>
      <button
        className="option-btn w-100 mb-1"
        onClick={() => handleOptionClick("Custom lyrics")}
      >
        Custom lyrics
      </button>
      <button
        className="option-btn w-100 mb-1"
        onClick={() => handleOptionClick("Hide Lyrics")}
      >
        {showHideLabel}
      </button>
    </div>
  );
};

export default LyricOption;
