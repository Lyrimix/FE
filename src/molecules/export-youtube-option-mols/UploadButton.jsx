import { useState } from "react";
import { uploadYoutube, uploadToCloudinary } from "../../apis/ProjectApi";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { AUTH_URL, TOKEN } from "../../utils/constant";
import "./UploadButton.css";
import { useVideoContext } from "../../utils/context/VideoContext";
const UploadButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { projectInfo } = useProjectContext();
  const { projectVideo } = useVideoContext();

  // open popup login
  const openLoginPopup = () => {
    return window.open(
      AUTH_URL,
      "Google Login",
      "width=600,height=600,left=200,top=200"
    );
  };

  // Check token and call Upload
  const startTokenCheckTimer = (popup) => {
    if (!window.tokenCheckTimer) {
      window.tokenCheckTimer = setInterval(() => {
        const newToken = localStorage.getItem(TOKEN.ACCESS_TOKEN);
        if (newToken) {
          clearInterval(window.tokenCheckTimer);
          window.tokenCheckTimer = null;
          popup?.close();
          handleUpload();
        }
      }, 1000);
    }
  };

  const handleUpload = async () => {
    const accessToken = localStorage.getItem(TOKEN.ACCESS_TOKEN);
    // not logged in yet
    if (!accessToken) {
      const popup = openLoginPopup();
      startTokenCheckTimer(popup);
      return;
    }

    if (!projectInfo?.id) {
      alert("No videos selected yet.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadResponse = await uploadYoutube(accessToken, projectInfo.id);
      const videoId = uploadResponse.data.videoId;
      window.open(`https://studio.youtube.com/video/${videoId}/edit`, "_blank");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem(TOKEN.ACCESS_TOKEN);
        const popup = openLoginPopup();
        startTokenCheckTimer(popup);
      } else {
        alert("Upload failed!");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <button
      onClick={handleUpload}
      disabled={isUploading}
      className="btn bg-custom-secondary w-20 text-dark"
    >
      {isUploading ? "Uploading..." : "Upload to YouTubes"}
    </button>
  );
};

export default UploadButton;
