import React, { useState, useEffect } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import "./EditLyric.css";
import { TABS } from "../../utils/constant";

const EditLyric = ({ isOpen, toggle, lyric, handleSaveLyric }) => {
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
        i === index ? { ...item, [field]: value.trim() } : item
      )
    );
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleSave = () => {
    const formattedLyrics = lyricEdit.map((item) => {
      const parts = item.raw.split(",");
      parts[1] = item.start.trim();
      parts[2] = item.end.trim();
      parts.splice(9, parts.length - 9, item.text.trim());

      return parts.map((p, i) => (i >= 9 ? p.trimStart() : p)).join(",");
    });

    const assContent = lyric[0]
      .split(/\r?\n/)
      .map((line) =>
        line.startsWith(TABS.DIALOGUE) ? formattedLyrics.shift() : line
      )
      .join("\r\n");

    handleSaveLyric(assContent);
  };

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="end"
      backdrop={false}
      className="custom-offcanvas"
    >
      <OffcanvasHeader toggle={toggle} className="bg-dark text-white">
        Edit Lyrics
      </OffcanvasHeader>
      <OffcanvasBody className="bg-black">
        <div className="overflow-auto space-edit">
          {lyricEdit.map((line, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`p-2 mb-2 rounded ${
                selectedIndex === index
                  ? "border border-info"
                  : "border border-secondary"
              } bg-black transition`}
            >
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={line.start}
                  onChange={(e) => handleChange(index, "start", e.target.value)}
                  className="form-control text-info border-0 bg-transparent flex-grow-1 input-time"
                />
                <input
                  type="text"
                  value={line.end}
                  onChange={(e) => handleChange(index, "end", e.target.value)}
                  className="form-control text-info border-0 bg-transparent flex-grow-1 input-time"
                />
              </div>

              <input
                type="text"
                value={line.text}
                onChange={(e) => handleChange(index, "text", e.target.value)}
                className="form-control text-white border-0 bg-transparent"
              />
            </div>
          ))}
        </div>
        <Button
          color="light"
          className="mt-3 w-100"
          onClick={handleSave}
          disabled={lyricEdit.length === 0}
        >
          Save
        </Button>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default EditLyric;
