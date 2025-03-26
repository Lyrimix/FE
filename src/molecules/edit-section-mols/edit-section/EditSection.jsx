import React, { useState, useEffect, useRef } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { deleteBackGround, updateProject } from "../../../apis/ProjectApi";
import { ActionItem } from "./ActionItem";
import { ROW_HEIGHT, MIN_SCALE_COUNT, SCALE } from "../../../utils/constant";
import {
  updateProjectBackgrounds,
  generateTimelineData,
} from "../../../utils/project";
import {
  clampActionsToFileLength,
  generateEffectsFromFiles,
} from "../../../utils/file";
import TimelinePlayer from "../../../organisms/player/Player";
import "./EditSection.css";

export const EditSection = ({ maxDuration = 1000 }) => {
  const {
    selectedFiles,
    setSelectedFiles,
    ranges,
    setRanges,
    fileLength,
    projectVideo,
  } = useVideoContext();
  const [editorData, setEditorData] = useState([]);
  const {
    projectInfo,
    setProjectInfo,
    cloudinaryUrl,
    videoRef,
    timelineState,
    projectRatio,
    originalStartAndEndTime,
    setVideosDuration,
  } = useProjectContext();
  const [hoveredAction, setHoveredAction] = useState(null);
  const [effects, setEffects] = useState([]);
  const autoScrollWhenPlay = useRef(true);

  useEffect(() => {
    console.log("Updated originalStartAndEndTime:", originalStartAndEndTime);
  }, [originalStartAndEndTime]);

  useEffect(() => {
    if (!projectVideo) {
      return;
    }
    const checkVideoRef = setInterval(() => {
      if (videoRef.current) {
        setEffects(generateEffectsFromFiles(selectedFiles, videoRef));
        clearInterval(checkVideoRef);
      }
    }, 500);

    return () => clearInterval(checkVideoRef);
  }, [projectVideo]);

  useEffect(() => {
    if (selectedFiles.length !== fileLength.length) return;

    const timelineData = generateTimelineData(
      selectedFiles,
      fileLength,
      maxDuration
    );

    setEditorData(timelineData);
    setRanges(
      timelineData[0].actions.map((action) => [action.start, action.end])
    );
  }, [selectedFiles, fileLength]);

  useEffect(() => {
    if (!projectInfo.id || ranges.length === 0) {
      return;
    }
    const updatedProject = updateProjectBackgrounds(
      projectInfo,
      ranges,
      cloudinaryUrl
    );

    const durations = updatedProject.videos.map((video) => video.duration);
    setVideosDuration(durations);
    console.log("updatedProject:", updatedProject);
    setProjectInfo(updatedProject);

    updateProject(updatedProject).catch((error) =>
      console.error("Error updating project:", error)
    );
  }, [ranges, editorData]);

  const handleChange = (newData) => {
    if (!newData || newData.length === 0) {
      return;
    }

    const updatedData = clampActionsToFileLength(newData, fileLength);

    if (!updatedData[0] || !updatedData[0].actions) {
      return;
    }

    const sortedActions = [...updatedData[0].actions].sort(
      (a, b) => a.start - b.start
    );

    for (let i = 1; i < sortedActions.length; i++) {
      const duration = sortedActions[i].end - sortedActions[i].start;
      sortedActions[i].start = sortedActions[i - 1].end;
      sortedActions[i].end = sortedActions[i].start + duration;
    }

    updatedData[0].actions = sortedActions;

    setEditorData(updatedData);

    const updatedRanges = sortedActions.map((action) => [
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
        <div className="player-config w-100 h-5 d-flex">
          <TimelinePlayer
            timelineState={timelineState}
            autoScrollWhenPlay={autoScrollWhenPlay}
          />
        </div>

        <Timeline
          editorData={editorData}
          effects={effects}
          style={{ width: "100%" }}
          scale={SCALE}
          ref={timelineState}
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
