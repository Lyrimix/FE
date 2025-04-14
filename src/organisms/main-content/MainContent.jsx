import "./MainContent.css";
import { VideoSection } from "../../molecules/video-section-mols/video-section/VideoSection";
import { EditSection } from "../../molecules/edit-section-mols/edit-section/EditSection";

export const MainContent = () => {
  return (
    <div className="w-100 h-100">
      <div className="main-content__video-section d-flex justify-content-center mt-3">
        <VideoSection className="w-100 h-100" />
      </div>
      <div className="main-content__edit-section w-100 d-flex justify-content-center position-fixed">
        <EditSection className="w-100" />
      </div>
    </div>
  );
};
