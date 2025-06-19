import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  scale,
  scaleWidth,
  startLeft,
  Rates,
  EVENT_BUS_EVENTS,
  ENGINE_EVENTS,
  autoScrollFrom,
} from "../../utils/constant";
import { FiSave } from "react-icons/fi";
import { useSaveContext } from "../../utils/context/SaveContext";
import { useProjectContext } from "../../utils/context/ProjectContext";
import eventBus from "../../utils/eventBus";
import "./Player.css";
import { useVideoContext } from "../../utils/context/VideoContext";
import { ToastContainer, toast } from "react-toastify";

const { Option } = Select;

const TimelinePlayer = ({ timelineState, autoScrollWhenPlay }) => {
  // const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const {
    hasClickedSaveRef,
    prevEditorDataRef,
    showSaveButton,
    setShowSaveButton,
  } = useSaveContext();
  const { setIsDemoCutting, playerTime, isPlaying, setIsPlaying } =
    useProjectContext();
  const { setIsRemoveBackground, isShowRemoveBgButton } = useVideoContext();

  const handleUpdateClick = () => {
    hasClickedSaveRef.current = true;
    setIsDemoCutting(false);
    setShowSaveButton(false);
    prevEditorDataRef.current = {};
  };

  const handleRemoveBackgroundClick = () => {
    setIsRemoveBackground((prev) => !prev);
  };

  useEffect(() => {
    if (!timelineState.current) return;
    const engine = timelineState.current;
    setIsPlaying(false);

    engine.listener.on(ENGINE_EVENTS.PLAY, () => {
      console.log("is playing");
      setIsPlaying(true);
    });

    engine.listener.on(ENGINE_EVENTS.PAUSE, () => {
      setIsPlaying(false);
    });

    engine.listener.on(ENGINE_EVENTS.AFTER_SET_TIME, ({ time }) => {
      setTime(time);
      eventBus.emit(EVENT_BUS_EVENTS.TIME_UPDATED, time);
    });

    engine.listener.on(EVENT_BUS_EVENTS.SET_TIME_BY_TICK, ({ time }) => {
      setTime(time);
      eventBus.emit(EVENT_BUS_EVENTS.TIME_UPDATED, time);
      if (autoScrollWhenPlay.current) {
        const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
        timelineState.current.setScrollLeft(left);
      }
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
    };
  }, []);

  const handlePlayOrPause = () => {
    if (!timelineState.current) return;

    const isActuallyPlaying = timelineState.current.isPlaying;
    // console.log("timelineState.current.isPlaying:", isActuallyPlaying);

    if (isActuallyPlaying) {
      timelineState.current.pause();
      setIsPlaying(false); // cập nhật ngay UI
    } else {
      timelineState.current.play({ autoEnd: true });
      setIsPlaying(true); // cập nhật ngay UI
    }
  };

  const handleRateChange = (value) => {
    if (timelineState.current) {
      timelineState.current.setPlayRate(value);
    }
  };

  const timeRender = (time) => {
    const float = String(parseInt((time % 1) * 100)).padStart(2, "0");
    const min = String(parseInt(time / 60)).padStart(2, "0");
    const second = String(parseInt(time % 60)).padStart(2, "0");
    return `${min}:${second}.${float}`;
  };

  return (
    <div className="timeline-player">
      <div className="play-control" onClick={handlePlayOrPause}>
        {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
      </div>
      <div className="time">{timeRender(playerTime.toFixed(1))}</div>
      <div className="rate-control">
        <Select
          size="small"
          defaultValue={1}
          style={{ width: 120 }}
          onChange={handleRateChange}
        >
          {Rates.map((rate) => (
            <Option key={rate} value={rate}>
              {`${rate.toFixed(1)}x`}
            </Option>
          ))}
        </Select>
      </div>
      <div className="save-changes">
        {showSaveButton && (
          <button
            className="save-button btn btn-sm btn-success d-flex align-items-center gap-2 px-3 py-1 rounded ms-2"
            onClick={handleUpdateClick}
          >
            <FiSave />
            Save
          </button>
        )}
      </div>

      <div className="remove-background">
        {isShowRemoveBgButton === true && (
          <button
            className="btn btn-sm btn-danger d-flex align-items-center gap-2 px-3 py-1 rounded ms-2"
            onClick={handleRemoveBackgroundClick}
          >
            Remove Background
          </button>
        )}
      </div>
    </div>
  );
};

export default TimelinePlayer;
