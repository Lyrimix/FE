import React, { useState, useEffect } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import "./EditLyric.css";

const EditLyric = ({ isOpen, toggle, lyric, handleSaveLyric }) => {
  const [lyricEdit, setLyricEdit] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (Array.isArray(lyric) && typeof lyric[0] === "string") {
      setLyricEdit(lyric[0].split("\n"));
    } else {
      setLyricEdit([]);
    }
  }, [lyric]);

  const handleChange = (index, value) => {
    setLyricEdit((prev) => {
      const updatedLyrics = [...prev];
      updatedLyrics[index] = value;
      return updatedLyrics;
    });
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
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
        <div className="overflow-auto" style={{ maxHeight: "530px" }}>
          {lyricEdit.map((line, index) => {
            if (index % 4 === 1) {
              return (
                <div
                  key={index}
                  onClick={() => handleSelect(index)}
                  className={`p-2 mb-2 rounded ${
                    selectedIndex === index
                      ? "border border-info"
                      : "border border-secondary"
                  } bg-black transition`}
                >
                  <input
                    type="text"
                    value={lyricEdit[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="form-control text-info opacity-75 border-0 bg-transparent"
                  />
                  {index + 1 < lyricEdit.length && (
                    <input
                      type="text"
                      value={lyricEdit[index + 1]}
                      onChange={(e) => handleChange(index + 1, e.target.value)}
                      className="form-control text-white border-0 bg-transparent"
                    />
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
        <Button
          color="light"
          className="mt-3 w-100"
          onClick={() => handleSaveLyric(lyricEdit.join("\n"))}
          disabled={lyricEdit.length === 0}
        >
          Save
        </Button>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default EditLyric;
