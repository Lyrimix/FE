import React, { useState } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import { TIMELINE_SCALE, MIN_SCALE, ROW_HEIGHT } from "../../../utils/constant";
import "./TimelineEditor.css";

const mockEffect = {
  effect0: {
    id: "effect0",
    name: "Effect 0",
  },
  effect1: {
    id: "effect1",
    name: "Effect 1",
  },
};

const TimelineEditor = () => {
  const [editorData, setEditorData] = useState([]);

  return (
    <div className="timeline">
      <Timeline
        editorData={editorData}
        effects={mockEffect}
        scale={TIMELINE_SCALE}
        minScaleCount={MIN_SCALE}
        rowHeight={ROW_HEIGHT}
      />
    </div>
  );
};

export default TimelineEditor;
