import React, { useState, useEffect } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { updateProject, deleteBackGround } from "../../../apis/ProjectApi";
import { ActionItem } from "./ActionItem";
import { ROW_HEIGHT, MIN_SCALE_COUNT, SCALE } from "../../../utils/constant";

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
  }, [ranges, editorData]);

  const handleChange = (newData) => {
    if (!newData || newData.length === 0) {
      return;
    }

    const updatedData = newData.map((item) => {
      return {
        ...item,
        actions: item.actions.map((action, index) => {
          const startTime = action.start;
          let endTime = action.end;
          const maxDuration = fileLength[index] || Infinity;

          if (endTime > maxDuration) {
            alert(
              `End time ${endTime} exceeds file length ${maxDuration}. Clamping to max.`
            );
            return {
              ...action,
              end: startTime + maxDuration,
              maxEnd: maxDuration,
            };
          }
          return action;
        }),
      };
    });

    setEditorData(updatedData);

    const updatedRanges = updatedData[0].actions.map((action) => [
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

    if (actionIndex === -1) {
      return;
    }

    const updatedSelectedFiles = selectedFiles.filter(
      (_, index) => index !== actionIndex
    );
    setSelectedFiles(updatedSelectedFiles);

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
    <div className="container-fluid p-0">
      <div className="w-100 h-100 d-flex flex-column border border-secondary rounded">
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
          scale={SCALE}
          minScaleCount={MIN_SCALE_COUNT}
          rowHeight={ROW_HEIGHT}
          onChange={handleChange}
          getActionRender={(action) => (
            <ActionItem
              action={action}
              hoveredAction={hoveredAction}
              setHoveredAction={setHoveredAction}
              handleDelete={handleDelete}
            />
          )}
        />
      </div>
    </div>
  );
};
