import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './variable.env' });

// console.log(process.env.CLOUDINARY_API_KEY);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'raw',
    });

    if (uploadResult?.secure_url) {
      fs.unlinkSync(localFilePath);
    }

    return uploadResult;
  } catch (error) {
    console.error('Upload failed:', error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteOnCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return null;
    const deleteResult = await cloudinary.uploader.destroy(fileUrl, {
      resource_type: 'auto',
      invalidate: true,
    });
    return deleteResult;
  } catch (error) {
    console.log(error);
    return null;
  }
};
