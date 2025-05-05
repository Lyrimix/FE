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
export const SCALE = 15;
export const MIN_SCALE_COUNT = 10;
export const ROW_HEIGHT = 45;

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
export const CLOUD_NAME = "dta6fx6ja";
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
  SHOWLYRICS: "Show Lyrics",
};

export const BACKGROUND_IMAGES = [
  "https://res.cloudinary.com/dta6fx6ja/image/upload/v1739947631/cld-sample-5.jpg",
  "https://res.cloudinary.com/dta6fx6ja/image/upload/v1739947631/cld-sample-4.jpg",
  "https://res.cloudinary.com/dta6fx6ja/image/upload/v1739947631/cld-sample-3.jpg",
  "https://res.cloudinary.com/dta6fx6ja/image/upload/v1739947631/cld-sample-2.jpg",
  "https://res.cloudinary.com/dta6fx6ja/image/upload/v1739947631/cld-sample.jpg",
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
export const autoScrollFrom = 2900;

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

//ACTION
export const COPY_SUFFIX = "-copy";

//FONTS
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

export const EFFECT_GROUPS = [
  {
    name: "CURTAIN",
    type: "curtain",
    effects: [
      {
        effect: "VERTOPEN",
        type: "Vertical Open",
        type_request: "vertopen",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744601794/lsdb6x6tr1pt9tpubp5e.mp4",
      },
      {
        effect: "VERTCLOSE",
        type: "Vertical Close",
        type_request: "vertclose",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744601794/lsdb6x6tr1pt9tpubp5e.mp4",
      },
      {
        effect: "HORZOPEN",
        type: "Horizontal Open",
        type_request: "horzopen",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744601794/mezniqacfxgerqerewij.mp4",
      },
      {
        effect: "HORZCLOSE",
        type: "Horizontal Close",
        type_request: "horzclose",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744601794/yicuydqc8cx0wmpdyl7h.mp4",
      },
    ],
  },
  {
    name: "SLICE BLUR",
    type: "sliceblur",
    effects: [
      {
        effect: "HRSLICE",
        type: "Horizontal Slice",
        type_request: "hrslice",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616076/mcmqfxs7virlxdva1us5.mp4",
      },
      {
        effect: "VDSLICE",
        type: "Vertical Slice",
        type_request: "vdslice",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616128/qytzmvsv2lniikufwvhh.mp4",
      },
      {
        effect: "HLSLICE",
        type: "Diagonal Slice",
        type_request: "hlslice",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744615959/fnt3brca4ttt5lhpvma3.mp4",
      },
      {
        effect: "VUSLICE",
        type: "Zoom Slice",
        type_request: "vuslice",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616175/dqpbezrz1pp6diwrmk01.mp4",
      },
    ],
  },
  {
    name: "SLICE",
    type: "slice",
    effects: [
      {
        effect: "SLIDEUP",
        type: "Slide Up",
        type_request: "slideup",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616519/a6b86y1ibzljdvvusouq.mp4",
      },
      {
        effect: "SLIDELEFT",
        type: "Slide Left",
        type_request: "slideleft",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616444/uf0cbwfevmtd6xlo8zbo.mp4",
      },
      {
        effect: "SLIDERIGHT",
        type: "Slide Right",
        type_request: "slideright",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616477/udlbqqtxgb4hclqowjhr.mp4",
      },
      {
        effect: "SLIDEDOWN",
        type: "Slide Down",
        type_request: "slidedown",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616403/ox8bcnyvvx6npklzlpn4.mp4",
      },
    ],
  },
  {
    name: "DIAGONAL",
    type: "diag",
    effects: [
      {
        effect: "SLIDEBOTTOMLEFT",
        type: "Bottom Left",
        type_request: "diagbl",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616905/v2jnb7e367dwjwp9mnkv.mp4",
      },
      {
        effect: "SLIDEBOTTOMRIGHT",
        type: "Bottom Right",
        type_request: "diagbr",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616866/xnmys0qd5ddo4n5j30wq.mp4",
      },
      {
        effect: "SLIDETOPLEFT",
        type: "Top Left",
        type_request: "diagtl",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616843/u1iquujusofdqswv568i.mp4",
      },
      {
        effect: "SLIDETOPRIGHT",
        type: "Top Right",
        type_request: "diagtr",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744616771/nc78etz8kwb8odpx22h8.mp4",
      },
    ],
  },
  {
    name: "SMOOTH",
    type: "smooth",
    effects: [
      {
        effect: "SMOOTHUP",
        type: "Smooth up",
        type_request: "smoothup",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744617553/oecvjskbtzp9cjuxxbak.mp4",
      },
      {
        effect: "SMOOTHDOWN",
        type: "Smooth down",
        type_request: "smoothdown",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744617458/vnihbrqnlmfpuq7hfj8b.mp4",
      },
      {
        effect: "SMOOTHLEFT",
        type: "Smooth left",
        type_request: "smoothleft",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744617490/v2gz7hvkkuzzx1futsfq.mp4",
      },
      {
        effect: "SMOOTHRIGHT",
        type: "Smooth right",
        type_request: "smoothright",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744617525/aouad2guhpvtijbdjbqt.mp4",
      },
    ],
  },
  {
    name: "DIAGONAL CORNER",
    type: "diagonalcorner",
    effects: [
      {
        effect: "WIPETOPLEFT",
        type: "Top left",
        type_request: "wipetl",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744617994/zi3xpflj79gc6zycdsew.mp4",
      },
      {
        effect: "WIPETOPRIGHT",
        type: "Top right",
        type_request: "wipetr",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618015/tjqgsks3uasao4voxuzl.mp4",
      },
      {
        effect: "WIPEBOTTOMLEFT",
        type: "Bottom left",
        type_request: "wipebl",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744617907/fqp8bsavypbuk69ae7ds.mp4",
      },
      {
        effect: "WIPEBOTTOMRIGHT",
        type: "Bottom right",
        type_request: "wipebr",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744617938/qm6cftpolhspy6ofhrgu.mp4",
      },
    ],
  },
  {
    name: "WIPE",
    type: "wipe",
    effects: [
      {
        effect: "WIPEUP",
        type: "Wipe up",
        type_request: "wipeup",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618280/oo1lqjfhuis0zkmfdofw.mp4",
      },
      {
        effect: "WIPEDOWN",
        type: "Wipe down",
        type_request: "wipedown",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618185/tkvtkfgadzmnv6qfkdsv.mp4",
      },
      {
        effect: "WIPELEFT",
        type: "Wipe left",
        type_request: "wipeleft",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618213/t6hxqct7q1vfkn1jryxz.mp4",
      },
      {
        effect: "WIPERIGHT",
        type: "Wipe right",
        type_request: "wiperight",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618257/acldeggbdzzmoseusa21.mp4",
      },
    ],
  },
  {
    name: "CROP ZOOM SHAPE",
    type: "cropzoomshape",
    effects: [
      {
        effect: "CIRCLEOPEN",
        type: "Circle open",
        type_request: "circleopen",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618662/sh5o0qjnanf5vejjinn1.mp4",
      },
      {
        effect: "CIRCLECLOSE",
        type: "Circle close",
        type_request: "circleclose",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618603/mwnf7vo0cazzmtl6vfft.mp4",
      },
      {
        effect: "CIRCLECROP",
        type: "Circle crop",
        type_request: "circlecrop",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618633/ojiym7l3sdy94gf1vgho.mp4",
      },
      {
        effect: "RECTANGLECROP",
        type: "Rectangle crop",
        type_request: "rectcrop",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744618684/jgyivzlkybrza9fdubim.mp4",
      },
    ],
  },
  {
    name: "FADE DISSOLVE",
    type: "fadedissolve",
    effects: [
      {
        effect: "FADE",
        type: "Fade",
        type_request: "fade",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619157/n7nfo3hfdnmpip3g15jw.mp4",
      },
      {
        effect: "FADEBLACK",
        type: "Fade black",
        type_request: "fadeblack",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619193/aqq1uq6x9881ae8yg2ze.mp4",
      },
      {
        effect: "FADEGRAYS",
        type: "Fade grays",
        type_request: "fadegrays",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619223/rc6m2tqsjdsyeapxdln1.mp4",
      },
      {
        effect: "FADEWHITE",
        type: "Fade white",
        type_request: "fadewhite",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619245/xl009psuebe5ws7h9zcd.mp4",
      },
      {
        effect: "DISSOLVE",
        type: "Dissolve",
        type_request: "dissolve",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619398/ecs8w8xehibzs5fbwhfs.mp4",
      },
    ],
  },
  {
    name: "SQUEEZE",
    type: "squeezeh",
    effects: [
      {
        effect: "SQUEEZE HORIZONTAL",
        type: "Fade",
        type_request: "squeezeh",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619592/hlnniaffecjhi8kksuad.mp4",
      },
      {
        effect: "SQUEEZE Vertical ",
        type: "Squeeze Vertical",
        type_request: "squeezev",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619620/urhkffb7w4oeznm2bjab.mp4",
      },
    ],
  },
  {
    name: "ORTHER",
    type: "other",
    effects: [
      {
        effect: "DISTANCE",
        type: "distance",
        type_request: "distance",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619826/zmhxmfj7ut8dv1bcugi0.mp4",
      },
      {
        effect: "Horizontal ",
        type: "horizontal blur",
        type_request: "hblur",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619845/w8zia9o6oibnr67bryav.mp4",
      },
      {
        effect: "PIXELIZE",
        type: "pixelize",
        type_request: "pixelize",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619865/yteoi9mmubvmfhluvjke.mp4",
      },
      {
        effect: "RADIAL",
        type: "radial",
        type_request: "radial",
        video:
          "https://res.cloudinary.com/dm8flim64/video/upload/v1744619865/yteoi9mmubvmfhluvjke.mp4",
      },
    ],
  },
];

export const SLIDER_VALUE = 2;

export function cleanVideoId(url) {
  return url.replace(/\/v\d+\//, "/");
}

export function hasStartAndEnd(url) {
  return /so_\d+/.test(url) && /eo_\d+/.test(url);
}
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
export const AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload`;
export const TOKEN = {
  ACCESS_TOKEN: "accessToken",
  CODE: "code",
  TOKEN_RECEIVE: "TOKEN_RECEIVED",
};

export const INPUT = {
  TIME_DEFAULT: "0:00:00.00",
  DELETE: "Delete",
  BACKSPACE: "Backspace",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
};
