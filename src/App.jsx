import { VideoProvider } from "./utils/context/VideoContext";
import { ProjectProvider } from "./utils/context/ProjectContext";
import "./App.css";
import { HomePage } from "./pages/homepage/HomePage";
import { GlobalLoadingModal } from "./Organisms/global-loading/GlobalLoadingModal";

function App() {
  return (
    <div className="App">
      <ProjectProvider>
        <VideoProvider>
          <HomePage className="home-page"></HomePage>
          <GlobalLoadingModal />
        </VideoProvider>
      </ProjectProvider>
    </div>
  );
}

export default App;
