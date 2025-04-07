import React, { useState, useEffect, useRef } from "react";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import { useVideoContext } from "../../../utils/context/VideoContext";
import { useProjectContext } from "../../../utils/context/ProjectContext";
import { deleteBackGround } from "../../../apis/ProjectApi";
import { ActionItem } from "./ActionItem";
import {
  ROW_HEIGHT,
  MIN_SCALE_COUNT,
  SCALE,
  COPY_SUFFIX,
} from "../../../utils/constant";
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
import { useSaveContext } from "../../../utils/context/SaveContext";
import { updateProject } from "../../../apis/ProjectApi";

export const EditSection = ({ maxDuration = 1000 }) => {
  const {
    selectedFiles,
    setSelectedFiles,
    ranges,
    setRanges,
    fileLength,
    projectVideo,
    setOriginalDuration,
    setTrimmedDuration,
    setTempEnd,
    setAfterEnd,
    setPrevRanges,
    setCurrentRange,
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
    isDemoCutting,
    setIsDemoCutting,
    videoThumbnail,
    setIsFirstTimeCut,
    projectVideosID,
  } = useProjectContext();
  const [hoveredAction, setHoveredAction] = useState(null);
  const [effects, setEffects] = useState([]);
  const [storedStart, setStoredStart] = useState(null);
  const storedStartRef = useRef(null);
  const autoScrollWhenPlay = useRef(true);
  const hasLoggedRanges = useRef(false);

  const {
    hasClickedSaveRef,
    prevEditorDataRef,
    shouldUpdateProject,
    setShouldUpdateProject,
  } = useSaveContext();
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
      timelineData[0].actions
        .filter((action) => !action.id.includes(COPY_SUFFIX))
        .map((action) => [action.start, action.end])
    );
  }, [selectedFiles, fileLength]);

  useEffect(() => {
    if (!projectInfo.id || ranges.length === 0) {
      return;
    }
    if (!hasClickedSaveRef.current) {
      setCurrentRange((prev) => {
        return ranges;
      });
    }

    if (!isDemoCutting) {
      if (
        JSON.stringify(prevEditorDataRef.current) !== JSON.stringify(editorData)
      ) {
        prevEditorDataRef.current = editorData;

        prevEditorDataRef.current = editorData;
        handleChange(editorData);
      }

      const updatedProject = updateProjectBackgrounds(
        projectInfo,
        ranges,
        cloudinaryUrl
      );

      if (!hasLoggedRanges.current) {
        setPrevRanges(ranges);
        hasLoggedRanges.current = true;
      }

      const durations = updatedProject.videos.map((video) => video.duration);
      setVideosDuration(durations);
    }
  }, [ranges, editorData, isDemoCutting, cloudinaryUrl]);

  useEffect(() => {
    if (
      shouldUpdateProject &&
      cloudinaryUrl &&
      !isDemoCutting &&
      projectInfo.id &&
      ranges.length > 0
    ) {
      const updatedProject = updateProjectBackgrounds(
        projectInfo,
        ranges,
        cloudinaryUrl,
        "",
        projectVideosID
      );

      const durations = updatedProject.videos.map((video) => video.duration);
      setVideosDuration(durations);

      setProjectInfo(updatedProject);
      updateProject(updatedProject)
        .then(() => console.log("Project updated successfully"))
        .catch((error) => console.error("Error updating project:", error))
        .finally(() => {
          setIsDemoCutting(true);
          setIsFirstTimeCut(false);
          hasClickedSaveRef.current = false;
          setShouldUpdateProject(false);
        });
    }
  }, [cloudinaryUrl, shouldUpdateProject]);

  useEffect(() => {
    if (storedStartRef.current !== null) {
      setStoredStart(storedStartRef.current);
      storedStartRef.current = null;
    }
  }, [editorData]);

  const filterActions = (data, includeCopy) =>
    data.map((item) => ({
      ...item,
      actions: item.actions.filter(
        (action) => includeCopy || !action.id.includes(COPY_SUFFIX)
      ),
    }));

  const adjustOriginalActions = (actions) => {
    return actions.map((action) => {
      if (!action.id.includes(COPY_SUFFIX)) {
        const duration = action.end - action.start;
        return { ...action, end: action.start + duration };
      }
      return action;
    });
  };

  const rebuildRanges = (actions, baseStart = 0) => {
    const ranges = [];
    for (let i = 0; i < actions.length; i++) {
      const duration = actions[i].end - actions[i].start;
      const start = i === 0 ? baseStart : ranges[i - 1][1];
      const end = start + duration;
      ranges.push([start, end]);
    }
    return ranges;
  };

  const handleDemoCuttingMode = (newData, fileLength) => {
    const filteredData = filterActions(newData, true);
    const updatedData = clampActionsToFileLength(filteredData, fileLength);

    if (!updatedData[0]?.actions) return;

    const sortedActions = updatedData[0].actions;
    const adjustedActions = adjustOriginalActions(sortedActions);
    const newTrimmedDuration = adjustedActions[adjustedActions.length - 1].end;

    setTrimmedDuration(newTrimmedDuration);
    updatedData[0].actions = adjustedActions;
    setEditorData(updatedData);

    const updatedRanges = adjustedActions
      .filter((action) => !action.id.includes(COPY_SUFFIX))
      .map((action) => [action.start, action.end]);

    setRanges(updatedRanges);
  };

  const handleNormalMode = (newData, fileLength) => {
    const filteredData = filterActions(newData, false);
    const updatedData = clampActionsToFileLength(filteredData, fileLength);

    if (!updatedData[0]?.actions) return;

    const sortedActions = updatedData[0].actions;

    if (sortedActions.length > 0) {
      storedStartRef.current = sortedActions[0].start;
      setOriginalDuration(
        originalStartAndEndTime[originalStartAndEndTime.length - 1][1]
      );
    }

    if (sortedActions.length > 0) {
      const duration = sortedActions[0].end - sortedActions[0].start;
      sortedActions[0].start = 0;
      sortedActions[0].end = duration;
    }

    for (let i = 1; i < sortedActions.length; i++) {
      const duration = sortedActions[i].end - sortedActions[i].start;
      setTempEnd(sortedActions[i].start);
      sortedActions[i].start = sortedActions[i - 1].end;
      sortedActions[i].end = sortedActions[i].start + duration;
      setAfterEnd(sortedActions[i].start);
    }

    const newTrimmedDuration = sortedActions[sortedActions.length - 1].end;
    setTrimmedDuration(newTrimmedDuration);

    updatedData[0].actions = sortedActions.flatMap((action) => [
      {
        ...action,
        id: action.id + COPY_SUFFIX,
        movable: false,
        flexible: false,
      },
      action,
    ]);

    setEditorData(updatedData);

    const updatedRanges = rebuildRanges(sortedActions, storedStartRef.current);
    setRanges(updatedRanges);
  };

  const handleChange = (newData) => {
    if (!newData || newData.length === 0) return;

    if (isDemoCutting) {
      handleDemoCuttingMode(newData, fileLength);
    } else {
      handleNormalMode(newData, fileLength);
    }
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

  const renderActionItem = ({
    action,
    hoveredAction,
    setHoveredAction,
    handleDelete,
    videoThumbnail,
  }) => {
    if (!videoThumbnail || videoThumbnail.length !== 2) return null;

    const match = action.id.match(/action(\d)/);
    const originalIndex = match ? parseInt(match[1], 10) : null;

    if (originalIndex === null || !videoThumbnail[originalIndex]) return null;

    const thumbnailItem = videoThumbnail[originalIndex];
    if (!thumbnailItem.thumbnailUrl) return null;

    return (
      <ActionItem
        action={action}
        hoveredAction={hoveredAction}
        setHoveredAction={setHoveredAction}
        handleDelete={handleDelete}
        thumbnail={thumbnailItem.thumbnailUrl}
      />
    );
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
          key={videoThumbnail.map((v) => v.thumbnailUrl).join("-")}
          editorData={editorData}
          effects={effects}
          style={{ width: "100%" }}
          scale={SCALE}
          ref={timelineState}
          minScaleCount={MIN_SCALE_COUNT}
          rowHeight={ROW_HEIGHT}
          onChange={handleChange}
          getActionRender={(action, index) =>
            renderActionItem({
              action,
              hoveredAction,
              setHoveredAction,
              handleDelete,
              videoThumbnail,
            })
          }
        />
      </div>
    </div>
  );
};
