import { CLOUD_NAME } from "../../src/utils/constant";

export const generateCloudinaryUrl = (videoName, background) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/l_${background},fl_relative,w_1.0,h_1.0,c_fill/${videoName}`;
};

export const extractSoAndEoFromUrl = (urls) => {
  return urls.map((url) => {
    const match = url.match(/so_(\d+(\.\d+)?),eo_(\d+(\.\d+)?)/);
    if (match) {
      const so = parseFloat(match[1]);
      const eo = parseFloat(match[3]);
      return [so, eo];
    }
    return null;
  });
};
