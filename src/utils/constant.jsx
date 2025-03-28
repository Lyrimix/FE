import {
  FaImage,
  FaVideo,
  FaMusic,
  FaMagic,
  FaFont,
  FaCog,
  FaClosedCaptioning,
} from "react-icons/fa";

export const PROJECT_NAME = "Lyrimix";
export const PROJECT_MAIN_THEME = "#CFF2E6";

//TIMELINE
export const MIN_SCALE = 2;
export const SCALE = 30;
export const MIN_SCALE_COUNT = 10;
export const ROW_HEIGHT = 40;

export const MOCK_EFFECT = {
  effect0: {
    id: "effect0",
    name: "Effect 0",
  },
  effect1: {
    id: "effect1",
    name: "Effect 1",
  },
};

//CLOUDINARY
export const CLOUD_NAME = "dnuyd3qxz";
export const UPLOAD_PRESET = "ml_default";

//API
export const API_URL = "http://localhost:8080/Lyrimix";

//SAMPLE IMAGE
export const SIDEBAR_ITEMS = [
  { icon: <FaImage />, label: "Background" },
  { icon: <FaVideo />, label: "Media" },
  { icon: <FaMusic />, label: "Audio" },
  { icon: <FaMagic />, label: "Effect" },
  { icon: <FaFont />, label: "Text" },
  { icon: <FaCog />, label: "Settings" },
  { icon: <FaClosedCaptioning />, label: "Lyric" },
];

export const EXPANDED_ITEMS = {
  Media: ["Upload Video", "Choose from Library"],
  Audio: ["Upload Audio", "Choose from Playlist"],
  Effect: ["Apply Filters", "Add Animations"],
  Text: ["Add Title", "Customize Font"],
  Settings: ["General", "Preferences"],
  Lyric: [
    "Create lyric automatically",
    "Edit lyric manually",
    "Hidden Lyrics",
    "Upload lyric file",
  ],
};

export const TABS = {
  LYRIC: "Lyric",
  BACKGROUND: "Background",
  SETTING: "Settings",
  MEDIA: "Media",
  AUDIO: "Audio",
  EFFECT: "Effect",
  TEXT: "Text",
  OPTIONS: "options",
  EDITLYRIC: "Edit lyric",
  EDITLYRICMANUALLY: "Edit lyric manually",
  CREATELYRICAUTOMATICALLY: "Create lyric automatically",
  DIALOGUE: "Dialogue:",
  HIDDENLYRICS: "Hidden Lyrics",
  SHOWLYRICS: "Show Lyrics",
};

export const BACKGROUND_IMAGES = [
  "https://res.cloudinary.com/dnuyd3qxz/image/upload/v1742877734/viyebmwbjmi0wnlmwjjq.png",
];

export const ContentType = {
  Json: "application/json",
  FormData: "multipart/form-data",
  UrlEncoded: "application/x-www-form-urlencoded",
  Text: "text/plain",
};

//PLAYER
export const scaleWidth = 160;
export const scale = 5;
export const startLeft = 20;
export const Rates = [0.2, 0.5, 1.0, 1.5, 2.0];
export const autoScrollFrom = 10000;

//EXPORT OPTION
export const exportOptions = ["Format", "mp4", "avi"];

//SIZE OPTIONS
export const sizeOptions = ["16:9", "1:1", "4:5", "9:16", "21:9"];
export const ratioSizes = {
  "16:9": "1280x720",
  "1:1": "424x424",
  "4:5": "720x900",
  "9:16": "720x1280",
  "21:9": "1920x823",
};

//ENGINE EVENT
export const ENGINE_EVENTS = {
  PLAY: "play",
  PAUSE: "paused",
  BEFORE_SET_TIME: "beforeSetTime",
  AFTER_SET_TIME: "afterSetTime",
};

//EVENT BUS EVENT
export const EVENT_BUS_EVENTS = {
  TIME_UPDATED: "timeUpdated",
  SET_TIME_BY_TICK: "setTimeByTick",
};
