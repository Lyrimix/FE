import { CLOUD_NAME } from "./constant";

export const generateCloudinaryUrl = (videoName, background) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/l_${background},fl_relative,w_1.0,h_1.0,c_fill/${videoName}`;
};
