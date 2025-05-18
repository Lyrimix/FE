import React, { useState, useEffect } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import "./EditLyric.css";
import { INPUT, TABS } from "../../utils/constant";
import { FaTrash, FaSyncAlt, FaSave } from "react-icons/fa";
import TimeInput from "../../atoms/inputs/TimeInput";

const EditLyric = ({
  isOpen,
  toggle,
  lyric,
  handleSaveLyric,
  onRefreshLyric,
}) => {
  const [lyricEdit, setLyricEdit] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const parseLyrics = (lyric) => {
      if (!Array.isArray(lyric) || typeof lyric[0] !== "string") return [];

      return lyric[0]
        .split(/\r?\n/)
        .filter((line) => line.startsWith(TABS.DIALOGUE))
        .map((line) => {
          const parts = line.split(",");
          return {
            raw: line,
            start: parts[1]?.trim() || "",
            end: parts[2]?.trim() || "",
            text: parts.slice(9).join(",").trim() || "",
          };
        });
    };

    setLyricEdit(parseLyrics(lyric));
  }, [lyric]);
  const handleChange = (index, field, value) => {
    setLyricEdit((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleSave = () => {
    // Separate header and footer
    const lines = lyric[0].split(/\r?\n/);
    const headerLines = lines.filter((line) => !line.startsWith(TABS.DIALOGUE));

    // Build new all lyrics from state
    const formattedLyrics = lyricEdit.map((item) => {
      const parts = item.raw.split(",");
      parts[1] = item.start.trim();
      parts[2] = item.end.trim();
      parts.splice(9, parts.length - 9, item.text.trim());
      return parts.map((p, i) => (i >= 9 ? p.trimStart() : p)).join(",");
    });

    // Combine all
    const assContent = [...headerLines, ...formattedLyrics].join("\r\n");

    handleSaveLyric(assContent);
  };

  const handleAddLine = (index) => {
    const currentLine = lyricEdit[index] || {};
    const newStart = currentLine.end || INPUT.TIME_DEFAULT;
    const newEnd = currentLine.end || INPUT.TIME_DEFAULT;
    const newText = "";

    const newRaw = `Dialogue: 0,${newStart},${newEnd},Default,,0,0,0,,"${newText}"`;

    const newLine = {
      raw: newRaw,
      start: newStart,
      end: newEnd,
      text: newText,
    };

    setLyricEdit((prev) => {
      const newLyrics = [...prev];
      newLyrics.splice(index + 1, 0, newLine);
      return newLyrics;
    });
  };

  const handleDeleteLine = (index) => {
    setLyricEdit((prev) => {
      const newLyrics = [...prev];
      newLyrics.splice(index, 1);
      return newLyrics;
    });
  };

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="end"
      backdrop={false}
      className="custom-offcanvas"
    >
      <OffcanvasHeader toggle={toggle} className="bg-white text-black">
        Edit Lyrics
      </OffcanvasHeader>
      <OffcanvasBody className=" body">
        <div className="overflow-auto space-edit item">
          {lyricEdit.map((line, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`p-2 mb-2 rounded ${
                selectedIndex === index
                  ? "border border-dark"
                  : "border border-secondary"
              }  transition`}
            >
              <div className="d-flex gap-2 ">
                <TimeInput
                  value={line.start}
                  onChange={(e) => handleChange(index, "start", e.target.value)}
                  className="form-control text-info border-0 bg-transparent flex-grow-1 input-time"
                />

                <TimeInput
                  value={line.end}
                  onChange={(e) => handleChange(index, "end", e.target.value)}
                  className="form-control text-info border-0 bg-transparent flex-grow-1 input-time"
                />

                <button
                  className="custom-button-add text-black mb-2 ms-2"
                  onClick={() => handleAddLine(index)}
                  title="Add a new line"
                >
                  +
                </button>
                <button
                  className="custom-button-delete text-black mb-2 "
                  onClick={() => handleDeleteLine(index)}
                  title="Remove"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              <input
                type="text"
                value={line.text}
                onChange={(e) => handleChange(index, "text", e.target.value)}
                className="form-control text-black border-0 bg-transparent input-white"
                placeholder="New text"
              />
            </div>
          ))}
        </div>
        <button
          color="light"
          className="mt-3 button-reload"
          onClick={onRefreshLyric}
        >
          Reload
        </button>
        <button
          className="mt-3 button-save"
          onClick={handleSave}
          disabled={lyricEdit.length === 0}
        >
          Save
        </button>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default EditLyric;
