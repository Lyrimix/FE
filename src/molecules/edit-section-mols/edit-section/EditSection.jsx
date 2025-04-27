import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useSaveContext } from "../../../utils/context/SaveContext";
import {
  updateProject,
  removeBackgroundOfEachVideo,
} from "../../../apis/ProjectApi";
import { extractSoAndEoFromUrl } from "../../../utils/cloudinaryUtils";
import "./EditSection.css";

export const EditSection = ({ maxDuration = 1000000 }) => {
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
    currentRange,
    setCurrentRange,
  } = useVideoContext();
  const [editorData, setEditorData] = useState([]);
  const {
    projectInfo,
    setProjectInfo,
    cloudinaryUrl,
    videoRef,
    timelineState,
    originalStartAndEndTime,
    setVideosDuration,
    isDemoCutting,
    setIsDemoCutting,
    videoThumbnail,
    setIsFirstTimeCut,
    projectVideosID,
    setProjectVideosId,
    prevSoEo,
    setPrevSoEo,
    currentCutTime,
    setCurrentCutTime,
    setOriginalCutTimeRef,
    originalStartEndOffset,
    setOriginalStartEndOffset,
    currentClickedVideo,
    setCurrentClickedVideo,
    videoUrlsWithBackground,
    videosId,
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
  const pendingSetRanges = useRef(false);
  const prevSoEoRef = useRef([]);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const RESIZE_DIRECTION_LEFT = "left";
  const RESIZE_DIRECTION_RIGHT = "right";
  const [tooltip, setTooltip] = useState({
    visible: false,
    value: 0,
    x: 0,
    y: 0,
  });
  const TOOLTIP_OFFSET_X = 10;
  const TOOLTIP_OFFSET_Y = -20;
  const prevShouldHideRef = useRef();

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

    if (isDemoCutting) return;

    const hasEditorChanged =
      JSON.stringify(prevEditorDataRef.current) !== JSON.stringify(editorData);

    if (hasEditorChanged) {
      prevEditorDataRef.current = editorData;
      handleChange(editorData);
    }

    const updatedProject = updateProjectBackgrounds(
      projectInfo,
      ranges,
      cloudinaryUrl
    );
    setVideosDuration(updatedProject.videos.map((video) => video.duration));

    if (!hasLoggedRanges.current) {
      setPrevRanges(ranges);
      hasLoggedRanges.current = true;
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
        projectVideosID,
        videoUrlsWithBackground
      );
      const durations = updatedProject.videos.map((video) => video.duration);
      setVideosDuration(durations);
      const extractedSoEo = extractSoAndEoFromUrl(projectVideosID);
      setPrevSoEo(extractedSoEo);
      prevSoEoRef.current = extractedSoEo;
      if (setOriginalCutTimeRef.current === null) {
        setCurrentCutTime(extractedSoEo);
        setOriginalCutTimeRef.current = extractedSoEo;
        setOriginalStartEndOffset(extractedSoEo);
      }

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

  const renderActionItem = useCallback(
    ({ action, handleDelete, videoThumbnail, isSelected, shouldHide }) => {
      if (!videoThumbnail) return null;

      const match = action.id.match(/action(\d)/);
      const originalIndex = match ? parseInt(match[1], 10) : null;

      if (originalIndex === null || !videoThumbnail[originalIndex]) return null;

      const thumbnailItem = videoThumbnail.find(
        (v) => v.fileName === action.videoName
      );
      if (!thumbnailItem.thumbnailUrl) return null;

      const isOriginal = !action.id.includes("-copy");
      const isSameTrack =
        getTrackIndexFromId(action.id) === currentClickedVideo;

      const backgroundColor =
        isOriginal && isSameTrack ? "red" : isSelected ? "#ffdd88" : "#ccc";

      return (
        <ActionItem
          style={{
            position: "absolute",
            backgroundColor,
            border: isSelected ? "2px solid orange" : "1px solid transparent",
            transition: "all 0.2s ease",
          }}
          action={action}
          handleDelete={handleDelete}
          thumbnail={thumbnailItem.thumbnailUrl}
          onDoubleClick={async (clickedAction) => {
            console.log("currentClickedVideo:", currentClickedVideo);
            console.log(
              "videoUrlsWithBackground[currentClickedVideo]",
              videoUrlsWithBackground[currentClickedVideo]
            );
            console.log("videoUrlsWithBackground", videoUrlsWithBackground);
            console.log(
              "projectVideoIds:",
              projectVideosID[currentClickedVideo]
            );
            const removeBackgroundResponse = await removeBackgroundOfEachVideo(
              videoUrlsWithBackground[currentClickedVideo],
              videosId[currentClickedVideo]
            );

            setProjectVideosId((prev) => {
              const updated = [...prev];
              updated[currentClickedVideo] =
                removeBackgroundResponse.data.result.asset;
              return updated;
            });
          }}
        />
      );
    },
    [
      SCALE,
      currentClickedVideo,
      videoUrlsWithBackground,
      projectVideosID,
      videosId,
    ]
  );

  const updateSoInUrl = (url, newSo) => {
    return url.replace(/so_(\d+(\.\d+)?),eo_/, `so_${newSo},eo_`);
  };

  const updateEoInUrl = (url, newEo) => {
    return url.replace(/eo_(\d+(\.\d+)?)/, `eo_${newEo}`);
  };
  const getBaseId = (id) => id.replace(COPY_SUFFIX, "");

  const getActionRender = (action, index) => {
    const baseActionId = getBaseId(action.id);
    const baseSelectedId = selectedActionId
      ? getBaseId(selectedActionId)
      : null;
    const shouldHide =
      baseSelectedId !== null && baseActionId !== baseSelectedId;

    return renderActionItem({
      action,
      handleDelete,
      videoThumbnail,
      isSelected: baseSelectedId !== null && baseActionId === baseSelectedId,
      shouldHide,
    });
  };

  const updateCurrentCutTime = (index, start, end) => {
    const rangeStart = ranges[index]?.[0];
    const so = prevSoEo[index]?.[0];

    if (rangeStart == null || so == null) return;

    const realStart = parseFloat((so + (start - rangeStart)).toFixed(5));
    const realEnd = parseFloat((so + (end - rangeStart)).toFixed(5));

    setCurrentCutTime((prev) => {
      const updated = [...(prev || [])];
      updated[index] = [realStart, realEnd];
      return updated;
    });
  };

  const handleActionResizing = ({ action, start, end, dir }) => {
    const isFirstAction = action.id === editorData[0].actions[1]?.id;
    const match = action.id.match(/action(\d+)/);
    const index = match ? parseInt(match[1], 10) : 0;
    const rangeStart = ranges[index]?.[0];
    const [so, eo] = prevSoEo[index] || [];
    const [originalSo, originalEo] = originalStartEndOffset[index] || [];

    if (rangeStart == null || so == null) return;
    const realStart = parseFloat((so + (start - rangeStart)).toFixed(5));
    const realEnd = parseFloat((so + (end - rangeStart)).toFixed(5));

    const tooltipValue = dir === RESIZE_DIRECTION_LEFT ? realStart : realEnd;

    if (
      (dir === RESIZE_DIRECTION_LEFT && realStart < originalSo) ||
      (dir === RESIZE_DIRECTION_RIGHT && realEnd > originalEo)
    ) {
      return false;
    }

    setTooltip({
      visible: true,
      value: tooltipValue,
      x: event?.clientX || 0,
      y: event?.clientY || 0,
    });

    updateCurrentCutTime(index, start, end);

    if (dir === RESIZE_DIRECTION_LEFT && isFirstAction) {
      return handleResizeLeft({ action, start });
    } else if (dir === RESIZE_DIRECTION_RIGHT && isFirstAction) {
      return handleResizeRight({ action });
    }
  };

  const handleResizeLeft = ({ action, start }) => {
    if (start < 0 && prevSoEo[0][0] !== 0 && shouldUpdateProject) {
      action.start = 0;
      const newSo = prevSoEo[0][0] - ranges[0][0];
      const updatedUrl = updateSoInUrl(projectVideosID[0], newSo);

      const newProjectVideosId = [...projectVideosID];
      newProjectVideosId[0] = updatedUrl;
      // setProjectVideosId(newProjectVideosId);
    } else if (start < 0 && prevSoEo[0][0] === 0) {
      return false;
    }
  };

  const handleResizeRight = ({ action }) => {
    if (shouldUpdateProject) {
      const newEo = prevSoEo[0][1] + (ranges[0][1] - currentRange[0][1]);
      action.end = newEo;

      const updatedUrl = updateEoInUrl(projectVideosID[0], newEo);
      const newProjectVideosId = [...projectVideosID];
      newProjectVideosId[0] = updatedUrl;
      // setProjectVideosId(newProjectVideosId);
    } else if (
      shouldUpdateProject &&
      prevSoEoRef.current[0][1] >
        originalStartAndEndTime[0][1] - originalStartAndEndTime[0][0]
    ) {
      return false;
    }
  };

  useEffect(() => {
    if (Array.isArray(pendingSetRanges.current)) {
      setRanges(pendingSetRanges.current);
      pendingSetRanges.current = false;
      setShouldUpdateProject(true);
    }
  }, [editorData]);

  const getTrackIndexFromId = (id) => {
    const match = id.match(/action(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  useEffect(() => {
    console.log("currentClickedVideo:", currentClickedVideo);
  }, [currentClickedVideo]);

  const handleClickAction = (e, param) => {
    const clickedAction = param.action;
    setCurrentClickedVideo(getTrackIndexFromId(clickedAction.id));
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

        {tooltip.visible && (
          <div
            className="tooltips"
            style={{
              left: tooltip.x + TOOLTIP_OFFSET_X,
              top: tooltip.y - TOOLTIP_OFFSET_Y,
            }}
          >
            {tooltip.value.toFixed(2)}s
          </div>
        )}

        <Timeline
          key={videoThumbnail.map((v) => v.thumbnailUrl).join("-")}
          editorData={editorData}
          effects={effects}
          style={{ width: "100%" }}
          scale={SCALE}
          ref={timelineState}
          minScaleCount={MIN_SCALE_COUNT}
          rowHeight={ROW_HEIGHT}
          onClickAction={handleClickAction}
          onChange={handleChange}
          getActionRender={getActionRender}
          onActionResizeStart={({ action }) => {
            setSelectedActionId(action.id);
          }}
          onActionResizing={handleActionResizing}
          onActionResizeEnd={() => {
            setTooltip((prev) => ({ ...prev, visible: false }));
            setSelectedActionId(null);
          }}
        />
      </div>
    </div>
  );
};
