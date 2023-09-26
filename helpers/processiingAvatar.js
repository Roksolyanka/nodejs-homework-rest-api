import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";

const processingAvatar = async (patchPhoto, filename) => {
  const newNameLogo = generateUniqName(filename);
  const uploadDir = path.join(process.cwd(), `/public/avatars/${newNameLogo}`);
  try {
    const image = await Jimp.read(patchPhoto);
    image.resize(250, 250);
    await image.writeAsync(uploadDir);
    fs.unlink(patchPhoto);
    return newNameLogo;
  } catch (err) {
    return err;
  }
};

const generateUniqName = (filename) => {
  console.log(filename);
  const format = filename.slice(-4);

  return `logoUser${format}`;
};
export default processingAvatar;
