import logo from "./logo.svg";
import "./App.css";
import { HomePage } from "./components/homepage/HomePage";
import { VideoProvider } from "./utils/context/VideoContext";
function App() {
  return (
    <div className="App">
      <VideoProvider>
        <HomePage className="home-page"></HomePage>
      </VideoProvider>
    </div>
  );
}

export default App;
