import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import "./VideoSorter.css";

const VideoSorterModal = ({
  isOpen,
  toggle,
  videos,
  setVideos,
  videoThumbnail,
  onConfirmUpload,
}) => {
  const [projectName, setProjectName] = useState("");
  const moveUp = (index) => {
    if (index === 0) return;
    const newVideos = [...videos];
    [newVideos[index - 1], newVideos[index]] = [
      newVideos[index],
      newVideos[index - 1],
    ];

    setVideos(newVideos);
  };
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };
  const handleAccept = () => {
    onConfirmUpload(videos, projectName); // Pass videos AND projectName
    setProjectName(""); // Optionally clear the input after submission
  };

  const moveDown = (index) => {
    if (index === videos.length - 1) return;
    const newVideos = [...videos];

    [newVideos[index], newVideos[index + 1]] = [
      newVideos[index + 1],
      newVideos[index],
    ];

    setVideos(newVideos);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" style={{ height: "20%" }}>
      <ModalHeader toggle={toggle}>Video import and arrangement</ModalHeader>

      <ModalBody>
        <ListGroup className="d-flex flex-row overflow-auto flex-nowrap w-100">
          {videos.map((video, index) => {
            const originalIndex = video.originalIndex;
            const thumbnailItem = videoThumbnail[originalIndex];
            const thumbnailUrl = thumbnailItem?.thumbnailUrl;
            return (
              <ListGroupItem
                key={video.id}
                className="list-group-item position-relative d-flex align-items-center justify-content-center p-0"
              >
                <button
                  // color="primary"
                  size="sm"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="button-left move-button move-button-left position-absolute"
                >
                  <FaArrowLeft />
                </button>

                <img
                  src={thumbnailUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-100 h-100 rounded object-fit-cover"
                />

                <button
                  // color="secondary"
                  size="sm"
                  onClick={() => moveDown(index)}
                  disabled={index === videos.length - 1}
                  className="button-right move-button move-button-right position-absolute"
                >
                  <FaArrowRight />
                </button>
              </ListGroupItem>
            );
          })}
        </ListGroup>
        <div class="project-name-container">
          <label htmlFor="projectName">Project name:</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            placeholder="project name"
            required
            value={projectName} // 4. Bind input value to state
            onChange={handleProjectNameChange} // 5. Add onChange handler
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          className="common-btn accept-btn"
          color="primary"
          onClick={handleAccept}
        >
          Accept
        </button>

        <button
          className="common-btn close-button"
          color="danger"
          onClick={toggle}
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default VideoSorterModal;
