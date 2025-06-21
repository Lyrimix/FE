import React from "react";
/*const lyricMenuItems = [
    "Create lyric automatically",
    "Edit lyric manually",
    "Custom lyrics",
    "Hide Lyrics", // Mục này sẽ có điều kiện hiển thị text
    "Upload lyric file",
  ];*/
const LyricOption = ({
  selectedTab,
  expandedItems,
  handleOptionClick,
  showHideLabel,
  TABS,
}) => {
  if (!expandedItems || !expandedItems[selectedTab]) {
    return null;
  }

  return (
    <div className="d-grid gap-2">
      <button
        className="option-btn w-100 mb-1"
        onClick={() => handleOptionClick("Upload lyric file")}
      >
        Upload lyric file
      </button>
      <button
        className="option-btn w-100 mb-1"
        onClick={() => handleOptionClick("Create lyric automatically")}
      >
        Create lyric automatically
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
        {showHideLabel ? "Show Lyrics" : "Hide Lyrics"}
      </button>
    </div>
  );
};

export default LyricOption;
