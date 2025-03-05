import "./MainContent.css";
import { VideoSection } from "../../Molecules/video-section-mols/video-section/VideoSection";
import { EditSection } from "../../Molecules/edit-section-mols/edit-section/EditSection";

export const MainContent = () => {
  return (
    <div className="main-content">
      <div className="main-content__video-section">
        <VideoSection className="main-content__video-element"></VideoSection>
      </div>
      <div className="main-content__edit-section">
        <EditSection className="main-content__time-stamp"> </EditSection>
      </div>
    </div>
  );
};
