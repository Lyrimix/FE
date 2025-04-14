import { VideoProvider } from "./utils/context/VideoContext";
import { ProjectProvider } from "./utils/context/ProjectContext";
import "./App.css";
import { HomePage } from "./pages/homepage/HomePage";
import { GlobalLoadingModal } from "./organisms/global-loading/GlobalLoadingModal";
import { SaveProvider } from "./utils/context/SaveContext";

function App() {
  return (
    <div className="App">
      <SaveProvider>
        <ProjectProvider>
          <VideoProvider>
            <HomePage className="home-page"></HomePage>
            <GlobalLoadingModal />
          </VideoProvider>
        </ProjectProvider>
      </SaveProvider>
    </div>
  );
}

export default App;
