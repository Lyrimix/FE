import { Upload } from "antd";
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
export const CLOUD_NAME = "dwwf8q2as";
export const UPLOAD_PRESET = "ml_default";

//API
// export const API_URL = "https://backend-production-9d88.up.railway.app/Lyrimix";
export const API_URL = "http://localhost:8080/Lyrimix";

//SAMPLE IMAGE
export const SIDEBAR_ITEMS = [
  { icon: <FaClosedCaptioning />, label: "Lyric" },
  { icon: <FaImage />, label: "Background" },
  { icon: <FaMagic />, label: "Effect" },

  // { icon: <FaVideo />, label: "Media" },
  // { icon: <FaMusic />, label: "Audio" },
  // { icon: <FaFont />, label: "Text" },
  // { icon: <FaCog />, label: "Settings" },
];

export const EXPANDED_ITEMS = {
  Media: ["Upload Video", "Choose from Library"],
  Audio: ["Upload Audio", "Choose from Playlist"],
  // Effect: ["Apply Filters", "Add Animations"],
  Text: ["Add Title", "Customize Font"],
  Settings: ["General", "Preferences"],
  Lyric: [
    "Create lyric automatically",
    "Edit lyric manually",
    "Custom lyrics",
    "Hide Lyrics",
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
  UPLOADLYRIC: "Upload lyric file",
  DIALOGUE: "Dialogue:",
  HIDDENLYRICS: "Hide Lyrics",
  SHOWLYRICS: "Show Lyrics",
};

export const BACKGROUND_IMAGES = [
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249603/ca1ebc4f8cd7f57dba1a3f1941eac31a_okyjmm.jpg",
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249951/57759e336a8fb65b8d05f17dbfb6533d_wvgcvu.jpg",
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249982/1d417ed54ba19db42567f0ec9dd2d6e2_wtit3n.jpg",
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249983/5577cfb89a16253d102fc0e7bbeac2b6_czyiqy.jpg",
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249556/86cc15202f94ab84160d132a384879b3_fprymb.jpg",
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249984/12891f9d6b413fbe6f33802023a2ed22_pjoejs.jpg",
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249984/dd92738efd60b31fdeff337b9334d7ef_ygqvqt.jpg",
  "https://res.cloudinary.com/dwwf8q2as/image/upload/v1750249983/258318129a7fe3d08b13d320607bfcd5_joovqw.jpg",
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
  // {
  //   name: "CURTAIN",
  //   type: "curtain",
  //   effects: [
  //     {
  //       effect: "VERTOPEN",
  //       type: "Vertical Open",
  //       type_request: "vertopen",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749880890/vertopen_u4d6cu.mp4",
  //     },
  //     {
  //       effect: "VERTCLOSE",
  //       type: "Vertical Close",
  //       type_request: "vertclose",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749880889/vertclose_bb3fki.mp4",
  //     },
  //     {
  //       effect: "HORZOPEN",
  //       type: "Horizontal Open",
  //       type_request: "horzopen",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749880889/horzopen_bdk70b.mp4",
  //     },
  //     {
  //       effect: "HORZCLOSE",
  //       type: "Horizontal Close",
  //       type_request: "horzclose",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749880889/horzclose_sg2aib.mp4",
  //     },
  //   ],
  // },
  {
    name: "SLICE BLUR",
    type: "sliceblur",
    effects: [
      {
        effect: "HRSLICE",
        type: "Horizontal Slice",
        type_request: "hrslice",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353712/hrslice_ipmvu9.mp4",
      },
      {
        effect: "VDSLICE",
        type: "Vertical Slice",
        type_request: "vdslice",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353713/vdslice_ft5feg.mp4",
      },
      {
        effect: "HLSLICE",
        type: "Diagonal Slice",
        type_request: "hlslice",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353711/hlslice_lplggn.mp4",
      },
      {
        effect: "VUSLICE",
        type: "Zoom Slice",
        type_request: "vuslice",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353714/vuslice_rmqrkf.mp4",
      },
    ],
  },
  {
    name: "SLIDE",
    type: "slide",
    effects: [
      {
        effect: "SLIDEUP",
        type: "Slide Up",
        type_request: "slideup",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353623/slideup_xxwuli.mp4",
      },
      {
        effect: "SLIDELEFT",
        type: "Slide Left",
        type_request: "slideleft",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353620/slideleft_nrnk5s.mp4",
      },
      {
        effect: "SLIDERIGHT",
        type: "Slide Right",
        type_request: "slideright",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353621/slideright_uhlzjo.mp4",
      },
      {
        effect: "SLIDEDOWN",
        type: "Slide Down",
        type_request: "slidedown",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353616/slidedown_jmvqod.mp4",
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
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353376/diagbl_qbppll.mp4",
      },
      {
        effect: "SLIDEBOTTOMRIGHT",
        type: "Bottom Right",
        type_request: "diagbr",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353376/diagbr_lmnyfg.mp4",
      },
      {
        effect: "SLIDETOPLEFT",
        type: "Top Left",
        type_request: "diagtl",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353377/diagtl_hedbjp.mp4",
      },
      {
        effect: "SLIDETOPRIGHT",
        type: "Top Right",
        type_request: "diagtr",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353377/diagtr_uxqhov.mp4",
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
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353804/smoothup_w8xbfe.mp4",
      },
      {
        effect: "SMOOTHDOWN",
        type: "Smooth down",
        type_request: "smoothdown",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353800/smoothdown_yv1wrt.mp4",
      },
      {
        effect: "SMOOTHLEFT",
        type: "Smooth left",
        type_request: "smoothleft",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353800/smoothleft_xmnw6v.mp4",
      },
      {
        effect: "SMOOTHRIGHT",
        type: "Smooth right",
        type_request: "smoothright",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750353801/smoothright_bcegab.mp4",
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
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351105/wipeup_aar8rt.mp4",
      },
      {
        effect: "WIPEDOWN",
        type: "Wipe down",
        type_request: "wipedown",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351105/wipedown_qgu6yo.mp4",
      },
      {
        effect: "WIPELEFT",
        type: "Wipe left",
        type_request: "wipeleft",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351105/wipeleft_dt00ag.mp4",
      },
      {
        effect: "WIPERIGHT",
        type: "Wipe right",
        type_request: "wiperight",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351105/wiperight_gydadz.mp4",
      },
      {
        effect: "WIPETOPLEFT",
        type: "Top left",
        type_request: "wipetl",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351245/wipetl_mewihb.mp4",
      },
      {
        effect: "WIPETOPRIGHT",
        type: "Top right",
        type_request: "wipetr",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351245/wipetr_jwqdd7.mp4",
      },
      {
        effect: "WIPEBOTTOMLEFT",
        type: "Bottom left",
        type_request: "wipebl",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351246/wipebl_t1aj8x.mp4",
      },
      {
        effect: "WIPEBOTTOMRIGHT",
        type: "Bottom right",
        type_request: "wipebr",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351245/wipebr_zkylfp.mp4",
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
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351351/circleopen_dl1gsa.mp4",
      },
      {
        effect: "CIRCLECLOSE",
        type: "Circle close",
        type_request: "circleclose",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351351/circleclose_eq0rjv.mp4",
      },
      {
        effect: "CIRCLECROP",
        type: "Circle crop",
        type_request: "circlecrop",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351352/circlecrop_xbfunp.mp4",
      },
      {
        effect: "RECTANGLECROP",
        type: "Rectangle crop",
        type_request: "rectcrop",
        video:
          "https://res.cloudinary.com/dwwf8q2as/video/upload/v1750351351/rectcrop_gdvjkc.mp4",
      },
    ],
  },
  // {
  //   name: "FADE DISSOLVE",
  //   type: "fadedissolve",
  //   effects: [
  //     {
  //       effect: "FADE",
  //       type: "Fade",
  //       type_request: "fade",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884615/fade_cgz5ke.mp4",
  //     },
  //     {
  //       effect: "FADEBLACK",
  //       type: "Fade black",
  //       type_request: "fadeblack",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884616/fadeblack_gxqyuu.mp4",
  //     },
  //     {
  //       effect: "FADEGRAYS",
  //       type: "Fade grays",
  //       type_request: "fadegrays",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884616/fadegrays_ioo4dh.mp4",
  //     },
  //     {
  //       effect: "FADEWHITE",
  //       type: "Fade white",
  //       type_request: "fadewhite",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884618/fadewhite_n1c22s.mp4",
  //     },
  //     {
  //       effect: "DISSOLVE",
  //       type: "Dissolve",
  //       type_request: "dissolve",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884616/dissolve_gifrrd.mp4",
  //     },
  //   ],
  // },
  // {
  //   name: "SQUEEZE",
  //   type: "squeezeh",
  //   effects: [
  //     {
  //       effect: "SQUEEZE HORIZONTAL",
  //       type: "Fade",
  //       type_request: "squeezeh",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884701/squeezeh_ip0tkv.mp4",
  //     },
  //     {
  //       effect: "SQUEEZE Vertical ",
  //       type: "Squeeze Vertical",
  //       type_request: "squeezev",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884702/squeezev_fuszvx.mp4",
  //     },
  //   ],
  // },
  // {
  //   name: "ORTHER",
  //   type: "other",
  //   effects: [
  //     {
  //       effect: "DISTANCE",
  //       type: "distance",
  //       type_request: "distance",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884739/distance_csdzf8.mp4",
  //     },
  //     {
  //       effect: "Horizontal ",
  //       type: "horizontal blur",
  //       type_request: "hblur",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884743/hblur_f1jdz1.mp4",
  //     },
  //     {
  //       effect: "PIXELIZE",
  //       type: "pixelize",
  //       type_request: "pixelize",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884744/pixelize_udlrgm.mp4",
  //     },
  //     {
  //       effect: "RADIAL",
  //       type: "radial",
  //       type_request: "radial",
  //       video:
  //         "https://res.cloudinary.com/dlqmbuvb0/video/upload/v1749884745/radial_iwpoin.mp4",
  //     },
  //   ],
  // },
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
