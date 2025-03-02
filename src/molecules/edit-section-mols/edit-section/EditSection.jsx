import React, { useState, useEffect } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import "./EditSection.css";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { updateProject, deleteBackGround } from "../../../apis/ProjectApi";
export const EditSection = ({ maxDuration = 1000 }) => {
  const { selectedFiles, setSelectedFiles, ranges, setRanges, fileLength } =
    useVideoContext();
  const [editorData, setEditorData] = useState([]);
  const { projectInfo, setProjectInfo } = useProjectContext();
  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => {
    if (selectedFiles.length !== fileLength.length) return;

    let accumulatedStart = 0;

    const timelineData = [
      {
        id: "singleRow",
        actions: selectedFiles.map((file, index) => {
          const start = accumulatedStart;
          const duration = fileLength[index] || maxDuration;
          const end = start + duration;
          accumulatedStart = end;

          return {
            id: `action${index}`,
            start,
            end,
            effectId: `effect${index}`,
          };
        }),
      },
    ];

    setEditorData(timelineData);
    setRanges(
      timelineData[0].actions.map((action) => [action.start, action.end])
    );
  }, [selectedFiles, fileLength]);

  useEffect(() => {
    if (!projectInfo.id || ranges.length === 0) return;

    const updatedBackgrounds = projectInfo.backgrounds.map((bg, index) => ({
      ...bg,
      startTime: ranges[index]?.[0] || 0,
      endTime: ranges[index]?.[1] || 0,
    }));

    const updatedProject = { ...projectInfo, backgrounds: updatedBackgrounds };

    setProjectInfo(updatedProject);

    updateProject(updatedProject)
      .then(() => console.log("Project updated successfully"))
      .catch((error) => console.error("Error updating project:", error));
  }, [ranges]);

  const handleChange = (newData) => {
    setEditorData(newData);
    const updatedRanges = newData[0].actions.map((action) => [
      action.start,
      action.end,
    ]);
    setRanges(updatedRanges);
  };

  const handleDelete = (actionId) => {
    const newEditorData = editorData.map((row) => ({
      ...row,
      actions: row.actions.filter((action) => action.id !== actionId),
    }));

    setEditorData(newEditorData);
    setRanges(
      newEditorData[0].actions.map((action) => [action.start, action.end])
    );

    const actionIndex = editorData[0].actions.findIndex(
      (action) => action.id === actionId
    );
    if (actionIndex === -1) return;

    const backgroundToDelete = projectInfo.backgrounds[actionIndex];

    if (backgroundToDelete) {
      deleteBackGround(backgroundToDelete.id)
        .then(() => console.log(`Background ${backgroundToDelete.id} deleted`))
        .catch((error) => console.error("Error deleting background:", error));

      const updatedBackgrounds = projectInfo.backgrounds.filter(
        (_, index) => index !== actionIndex
      );
      setProjectInfo({ ...projectInfo, backgrounds: updatedBackgrounds });
    }
  };

  return (
    <div className="edit-section" style={{ width: "100%", height: "500px" }}>
      <Timeline
        editorData={editorData}
        effects={selectedFiles.reduce(
          (acc, file, index) => ({
            ...acc,
            [`effect${index}`]: { id: `effect${index}`, name: file.name },
          }),
          {}
        )}
        style={{ width: "100%" }}
        scale={30}
        minScaleCount={10}
        rowHeight={40}
        onChange={handleChange}
        getActionRender={(action) => (
          <div
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "4px",
              position: "relative",
            }}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
          >
            <img
              src={
                "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-5.jpg"
              }
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                marginBottom: "40px",
              }}
              alt="Thumbnail"
            />
            {hoveredAction === action.id && (
              <button
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(action.id)}
              >
                ×
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
};
