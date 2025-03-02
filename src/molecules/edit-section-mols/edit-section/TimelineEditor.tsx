import React, { useState } from "react";
import { Timeline, TimelineEffect, TimelineRow, TimelineAction } from "@xzdarcy/react-timeline-editor";
import "./TimelineEditor.css"
const mockData: TimelineRow[] = [
  {
    id: "0",
    actions: [
      {
        id: "action00",
        start: 0,
        end: 2,
        effectId: "effect0",
      },
      {
        id: "action01",
        start: 3,
        end: 5,
        effectId: "effect0",
      },
    ],
  },
  {
    id: "1",
    actions: [
      {
        id: "action10",
        start: 1.5,
        end: 5,
        effectId: "effect1",
      },
    ],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: "effect0",
    name: "Effect 0",
  },
  effect1: {
    id: "effect1",
    name: "Effect 1",
  },
};

const TimelineEditor: React.FC = () => {
  const [editorData, setEditorData] = useState<TimelineRow[]>([]);
  
  const handleChange = (newData: TimelineRow[]) => {
    setEditorData(newData); 
  };

  return (
    <div style={{ width: "100%", height: "500px"  }}>
      <Timeline
    editorData={editorData}
    effects={mockEffect}
    scale={2}
    minScaleCount={10}
    rowHeight={40}
    onChange={handleChange}
  getActionRender={(action: TimelineAction) => (
    <div
      style={{
        height: "100%",
        width:"100%",
        borderRadius: "4px",

      }}
    > 
      <img 
      src="https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-5.jpg"
      crossOrigin="anonymous"
      style={{width:"100%" , height: "100%" , objectFit:"cover"}}></img>
    </div>
  )}
/>
 
    </div>
  );
};

export default TimelineEditor;