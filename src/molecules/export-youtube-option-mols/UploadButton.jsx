import { useEffect, useState } from "react";
import { getAccessToken, uploadYoutube } from "../../apis/ProjectApi";
import { useProjectContext } from "../../utils/context/ProjectContext";
import { AUTH_URL, TOKEN } from "../../utils/constant";
import "./UploadButton.css";

const UploadButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { projectInfo } = useProjectContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get(TOKEN.CODE);

    if (code) {
      getAccessToken(code)
        .then((token) => {
          const accessToken = token.data.access_token;
          localStorage.setItem(TOKEN.ACCESS_TOKEN, accessToken);

          window.close();
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
        });
    }
  }, []);

  const handleUpload = async () => {
    const accessToken = localStorage.getItem(TOKEN.ACCESS_TOKEN);

    if (!accessToken) {
      const popup = window.open(
        AUTH_URL,
        "Google Login",
        "width=600,height=600,left=200,top=200"
      );
      return;
    }

    if (!projectInfo?.id) {
      alert("No videos selected yet.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadResponse = await uploadYoutube(accessToken, projectInfo.id);
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video", error);
      alert("Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <button
      onClick={handleUpload}
      disabled={isUploading}
      className="upload-button"
    >
      {isUploading ? "Uploading..." : " YouTube"}
    </button>
  );
};

export default UploadButton;
