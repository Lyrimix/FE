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
export const CLOUD_NAME = "db6fvvwri";
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
  EDITLYRIC: "editLyric",
  EDITLYRICMANUALLY: "Edit lyric manually",
  CREATELYRICAUTOMATICALLY: "Create lyric automatically",
};

export const BACKGROUND_IMAGES = [
  "https://s3-alpha-sig.figma.com/img/e2fd/af1b/8ad08b9754a92462e8db52279fb5c606?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=r6UOQ8dkk3UuX0iXKNZobkO7vD~jS8jhe2TJQUcFWp4Sm9qv8onCyFA82vScD4VcH1c0nluK2tBgLB6ne3vhFdYv3MOYX6MI5lVA2hpf7Q0U-pnAusg7kxaKJR24npmrciQx8XFLgjfD9OiJjBB2AT8hEKd9MZglSP-plwXTMe3xzKdEiDwJHnmF4lihH2FG9VAJazL8v1C-sLwhgzNGS-81Vnlf5ZHKbNnnHRF37bW18qxteUApjJUzTuOC8ZoCd5whmM-yY9oVhRCQD3Kn814lS8is~8MM4qouEUw2xVb1NtkTEw8DH8Vm51R0aCY3K2ir2G8mQbxZbp53fnHVog__",
  "https://s3-alpha-sig.figma.com/img/3164/120d/0d31f2410ad4b4977d01b4a7f5e9d124?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=VTc52p9Ud622JukNygK~x0otL94w6A~KpvgG03gPh0iQqEVFwwz6Gaji8~E9dyopSq3OfsMcyrzxUfQMeuBkyRl0-kKfeMl6i-tKyPJItdrfB3SulGD6RawtYn1BQvb5kOeru3K5PqOWCITK0eCdWqKn5Mfdh6gbIsboN3w9~Z0GYNnGKy~~WzN62ILkmm3d7kYRaznDJWxcK2IJGLc4TG3tD9fTSAda2k07a5nkKKJAKg6cOMHk6KzG3h0kkHVHWK~--NWGjh0VXrK-v1P2kw9i21J49WPhgaSZ3dDALM2oLJQ1puPPXpKQAxl4k599bQBje4JlvcJdzCI-kfWgKQ__",
  "https://s3-alpha-sig.figma.com/img/996f/8e5d/ae05ca1a41a2be13f430b45e7fb09126?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TFt7VtzRmiL2lfGrUP7krCroPrPaDr6H3qEOifoCsFelooz~-rV~ByiQbRHCspFtLlqg8jC-qnRvjEF34vLzKe~vJopwq-utaYGbvJ6cMk5uwWOeurfQU02kXNevuqV0UTK3DRtA1b1W0sZNz8zSZhGnWmJ0xBHrPMzVU20Vedep1tR5Q3trioZEhXKDodrEmrCTxknTJojCpEtnnbfnrpDBjztUnJEcSNC-RadYfTniP67Vyf0bznAN1nrySmoHiXH4xDt5tw57WvbcVTjJ5hDiUop~camwJTGxCaI2YDdCGXvnTSlGgd4J6sa52upHGfspt8XMO9ggqpeisAfxfQ__",
  "https://s3-alpha-sig.figma.com/img/e2fd/af1b/8ad08b9754a92462e8db52279fb5c606?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=r6UOQ8dkk3UuX0iXKNZobkO7vD~jS8jhe2TJQUcFWp4Sm9qv8onCyFA82vScD4VcH1c0nluK2tBgLB6ne3vhFdYv3MOYX6MI5lVA2hpf7Q0U-pnAusg7kxaKJR24npmrciQx8XFLgjfD9OiJjBB2AT8hEKd9MZglSP-plwXTMe3xzKdEiDwJHnmF4lihH2FG9VAJazL8v1C-sLwhgzNGS-81Vnlf5ZHKbNnnHRF37bW18qxteUApjJUzTuOC8ZoCd5whmM-yY9oVhRCQD3Kn814lS8is~8MM4qouEUw2xVb1NtkTEw8DH8Vm51R0aCY3K2ir2G8mQbxZbp53fnHVog__",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-5.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-4.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-3.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample-2.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/cld-sample.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/dessert-on-a-plate.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/woman-on-a-football-field.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/upscale-face-1.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/coffee.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/cup-on-a-table.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/man-portrait.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/chair.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/chair-and-coffee-table.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/man-on-a-escalator.jpg",
  "https://res.cloudinary.com/duli95mss/image/upload/v1739947631/samples/man-on-a-street.jpg",
];

//API
export const ContentType = {
  Json: "application/json",
  FormData: "multipart/form-data",
  UrlEncoded: "application/x-www-form-urlencoded",
  Text: "text/plain",
};
