import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VideoProvider } from "./utils/context/VideoContext";
import { ProjectProvider } from "./utils/context/ProjectContext";
import "./App.css";
import { HomePage } from "./pages/homepage/HomePage";
import { GlobalLoadingModal } from "./organisms/global-loading/GlobalLoadingModal";
import { SaveProvider } from "./utils/context/SaveContext";
import OauthCallback from "./pages/OAuthCallback";
import LoginPage from "./pages/loginpage/LoginPage";

function App() {
  return (
    <div className="App">
      <ProjectProvider>
        <VideoProvider>
          <SaveProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/oauth-callback" element={<OauthCallback />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
              <GlobalLoadingModal />
            </Router>
          </SaveProvider>
        </VideoProvider>
      </ProjectProvider>
    </div>
  );
}

export default App;
