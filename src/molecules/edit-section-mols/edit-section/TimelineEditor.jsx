import React, { useState } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import {
  MIN_SCALE,
  MIN_SCALE_COUNT,
  ROW_HEIGHT,
  MOCK_EFFECT,
} from "../../../utils/constant";
import "./TimelineEditor.css";
import "bootstrap/dist/css/bootstrap.css";

const TimelineEditor = () => {
  const [editorData, setEditorData] = useState([]);

  const handleChange = (newData) => {
    if (!newData || newData.length === 0) {
      return;
    }
    setEditorData(newData);
  };

  return (
    <div className="w-100 h-500">
      <Timeline
        editorData={editorData}
        effects={MOCK_EFFECT}
        scale={MIN_SCALE}
        minScaleCount={MIN_SCALE_COUNT}
        rowHeight={ROW_HEIGHT}
        onChange={handleChange}
        getActionRender={() => (
          <div className="w-100 h-100">
            <img
              src="https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-5.jpg"
              crossOrigin="anonymous"
              className="w-100 h-100 object-fit-cover"
            ></img>
          </div>
        )}
      />
    </div>
  );
};

export default TimelineEditor;
