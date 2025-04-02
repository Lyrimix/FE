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
    "Custom lyrics",
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
  CUSTOMLYRIC: "Custom lyrics",
  EDITLYRICMANUALLY: "Edit lyric manually",
  CREATELYRICAUTOMATICALLY: "Create lyric automatically",
  DIALOGUE: "Dialogue:",
  HIDDENLYRICS: "Hidden Lyrics",
  CUSTOMLYRIC: "Custom lyrics",
  SHOWLYRICS: "Show Lyrics",
};

export const BACKGROUND_IMAGES = [
  "https://res.cloudinary.com/dnuyd3qxz/image/upload/v1743391876/ol90v1eox2qmxn5fcinz.jpg",
  "https://res.cloudinary.com/dnuyd3qxz/image/upload/v1743392711/qev2lzlskistz3vfzijb.jpg",
  "https://res.cloudinary.com/dnuyd3qxz/image/upload/v1743392711/sh8rkzisyccinel4cpx6.webp",
  "https://res.cloudinary.com/dnuyd3qxz/image/upload/v1743392711/rylrwb4l7edxblq2uj1j.webp",
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
export const ASS_FONTS = [
  "Arial",
  "Arial Black",
  "Times New Roman",
  "Verdana",
  "Forte",
  "Tahoma",
  "Trebuchet MS",
  "Courier New",
  "Comic Sans MS",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Palatino Linotype",
  "Symbol",
  "Century Gothic",
  "Book Antiqua",
  "Franklin Gothic Medium",
  "MS Gothic",
  "MS Mincho",
  "Meiryo",
  "Garamond",
];

export const ALIGNMENT_MAPPING = {
  BL: 1,
  BC: 2,
  BR: 3,
  CL: 4,
  CC: 5,
  CR: 6,
  TL: 7,
  TC: 8,
  TR: 9,
};

export const POSITIONS = ["TL", "TC", "TR", "CL", "CC", "CR", "BL", "BC", "BR"];

export const TABS_CUSTOMS = [
  { id: "font", label: "Font" },
  { id: "color", label: "Color" },
  { id: "align", label: "Align" },
];

export const BUTTONS = [
  { label: "B", state: "bold", styleClass: "bold" },
  { label: "I", state: "italic", styleClass: "italic" },
  { label: "U", state: "underline", styleClass: "underline" },
  { label: "S", state: "strikeOut", styleClass: "strikeout" },
];
