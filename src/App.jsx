import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VideoProvider } from "./utils/context/VideoContext";
import { ProjectProvider } from "./utils/context/ProjectContext";
import "./App.css";
import { HomePage } from "./pages/homepage/HomePage";
import { GlobalLoadingModal } from "./organisms/global-loading/GlobalLoadingModal";
import { SaveProvider } from "./utils/context/SaveContext";
import { UserProvider } from "./utils/context/UserContext";
import OauthCallback from "./pages/OAuthCallback";
import LoginPage from "./pages/loginpage/LoginPage";
import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import "./style/ToastifyCustom.css";

function App() {
  return (
    <div className="App">
      <ProjectProvider>
        <UserProvider>
          <VideoProvider>
            <SaveProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/homepage" element={<HomePage />} />
                  <Route path="/oauth-callback" element={<OauthCallback />} />
                </Routes>
                <GlobalLoadingModal />
              </Router>
            </SaveProvider>
          </VideoProvider>
        </UserProvider>
      </ProjectProvider>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
