import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  scale,
  scaleWidth,
  startLeft,
  Rates,
  autoScrollFrom,
  EVENT_BUS_EVENTS,
  ENGINE_EVENTS,
} from "../../utils/constant";
import eventBus from "../../utils/eventBus";

const { Option } = Select;

const TimelinePlayer = ({ timelineState, autoScrollWhenPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!timelineState.current) return;
    const engine = timelineState.current;

    engine.listener.on(ENGINE_EVENTS.PLAY, () => {
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
    timelineState.current.isPlaying
      ? timelineState.current.pause()
      : timelineState.current.play({ autoEnd: true });
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
      <div className="time">{timeRender(time)}</div>
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
    </div>
  );
};

export default TimelinePlayer;
