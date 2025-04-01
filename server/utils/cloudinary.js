import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import ApiError from './apierror.js';

dotenv.config({ path: './variable.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicId = (fileUrl) => {
  if (!fileUrl) return null;
  const parts = fileUrl.split('/');
  const fileNameWithVersion = parts[parts.length - 1];
  const fileName = fileNameWithVersion.split('.')[0];
  return fileName;
};

export const uploadOnCloudinary = async (
  localFilePath,
  resourceType = 'auto'
) => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    if (uploadResult?.secure_url) {
      fs.unlinkSync(localFilePath);
    }

    return uploadResult;
  } catch (error) {
    return next(new ApiError('Error in uploading file', 422));
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteOnCloudinary = async (fileUrl, resourceType = 'auto') => {
  try {
    if (!fileUrl) return null;
    const public_id = extractPublicId(fileUrl);
    const deleteResult = await cloudinary.uploader.destroy(fileUrl, {
      resource_type: resourceType,
      invalidate: true,
    });
    return deleteResult;
  } catch (error) {
    return next(new ApiError('Error in deleting previous file', 422));
  }
};
