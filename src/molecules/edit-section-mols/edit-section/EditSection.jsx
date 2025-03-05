import React, { useState } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import { SCALE, MIN_SCALE, ROW_HEIGHT } from "../../../utils/constant";
import "bootstrap/dist/css/bootstrap.min.css";

export const EditSection = ({ maxDuration = 1000 }) => {
  const [editorData, setEditorData] = useState([]);

  const handleChange = (newData) => {
    if (!newData || newData.length === 0) {
      return;
    }
    setEditorData(newData);
  };

  return (
    <div className="container-fluid">
      <div className="w-100 h-100 d-flex flex-column border border-secondary rounded">
        <Timeline
          editorData={editorData}
          style={{ width: "100%" }}
          className="w-100"
          scale={SCALE}
          minScaleCount={MIN_SCALE}
          rowHeight={ROW_HEIGHT}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
