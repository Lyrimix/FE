import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import "./VideoSorter.css";

const VideoSorterModal = ({
  isOpen,
  toggle,
  videos,
  setVideos,
  videoThumbnail,
  onConfirmUpload,
}) => {
  const moveUp = (index) => {
    if (index === 0) return;
    const newVideos = [...videos];
    [newVideos[index - 1], newVideos[index]] = [
      newVideos[index],
      newVideos[index - 1],
    ];

    setVideos(newVideos);
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
      <ModalHeader toggle={toggle}>Arraging video</ModalHeader>

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
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="move-button move-button-left position-absolute"
                >
                  ⬅️
                </Button>

                <img
                  src={thumbnailUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-100 h-100 rounded object-fit-cover"
                />

                <Button
                  color="secondary"
                  size="sm"
                  onClick={() => moveDown(index)}
                  disabled={index === videos.length - 1}
                  className="move-button move-button-right position-absolute"
                >
                  ➡️
                </Button>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </ModalBody>

      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            onConfirmUpload(videos);
          }}
        >
          Accept
        </Button>

        <Button color="danger" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VideoSorterModal;
