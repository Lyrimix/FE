import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { exportLyric } from "../../apis/ProjectApi"; // Assuming exportProject handles subtitle export too
import "./SubtitleFormatSelectionModal.scss";
export const SubtitleFormatSelectionModal = ({
  show,
  onClose,
  projectId,
  projectName,
}) => {
  const [selectedFormat, setSelectedFormat] = useState(".srt"); // Default format
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const availableFormats = [
    { label: "SRT (.srt)", value: ".srt" },
    { label: "VTT (.vtt)", value: ".vtt" },
    { label: "TXT (.txt)", value: ".txt" },
    { label: "ASS (.ass)", value: ".ass" },
  ];

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleConfirmDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      await exportLyric(projectId, selectedFormat);
      onClose(); // Close the modal after initiating download
    } catch (error) {
      console.error("Error downloading subtitles:", error);
      setDownloadError("Failed to download subtitles. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="subtitle-format-modal">
      <Modal.Header closeButton>
        <Modal.Title>Download Subtitles - Select Format</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {downloadError && <Alert variant="danger">{downloadError}</Alert>}
        <Form>
          <Form.Group controlId="subtitleFormat">
            <Form.Label>Choose subtitle format:</Form.Label>
            {availableFormats.map((format) => (
              <Form.Check
                key={format.value}
                type="radio"
                id={`format-${format.value}`}
                label={format.label}
                name="subtitleFormat"
                value={format.value}
                checked={selectedFormat === format.value}
                onChange={handleFormatChange}
                disabled={isDownloading}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="cancel-btn" onClick={onClose} disabled={isDownloading}>
          Cancel
        </Button>
        <Button
          className="confirm-btn"
          onClick={handleConfirmDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Downloading...
            </>
          ) : (
            "Confirm Download"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
