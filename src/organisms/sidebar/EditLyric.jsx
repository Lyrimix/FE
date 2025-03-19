import React from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";

const EditLyric = ({
  isOpen,
  toggle,
  lyricEdit,
  setLyricEdit,
  handleSaveLyric,
}) => {
  const handleLyricChange = (e) => {
    setLyricEdit(e.target.value);
  };

  return (
    <Offcanvas isOpen={isOpen} toggle={toggle} direction="start">
      <OffcanvasHeader toggle={toggle} className="bg-dark text-white">
        Edit Lyrics
      </OffcanvasHeader>
      <OffcanvasBody className="bg-dark">
        <textarea
          className="form-control bg-dark text-light"
          rows="21"
          placeholder="Edit your lyrics here..."
          value={lyricEdit || ""}
          onChange={handleLyricChange}
        ></textarea>
        <Button color="light" className="mt-3 w-100" onClick={handleSaveLyric}>
          Save
        </Button>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default EditLyric;
