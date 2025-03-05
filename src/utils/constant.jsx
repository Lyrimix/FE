import { FaImage, FaMusic, FaFilm, FaMagic, FaFont } from "react-icons/fa";

//PROJECT
export const PROJECT_NAME = "Lyrimix";

//TIMELINE
export const SCALE = 30;
export const TIMELINE_SCALE = 2;
export const MIN_SCALE = 10;
export const ROW_HEIGHT = 40;

//SIDEBAR
export const SIDEBAR_ITEMS = [
  { name: "Background", icon: <FaImage /> },
  { name: "Media", icon: <FaFilm /> },
  { name: "Audio", icon: <FaMusic /> },
  { name: "Effect", icon: <FaMagic /> },
  { name: "Text", icon: <FaFont /> },
];

export const OPTIONS = [
  "Create lyric automatically",
  "Create lyric manually",
  "Upload lyric file",
  "Lyrics automatically",
];
