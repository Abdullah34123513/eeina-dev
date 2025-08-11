import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../constant.js";

// Configuring cloudinary
cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
})

// Upload file to cloudinary
const uploadFileCloudinary = async (file) => {
      console.log("Uploading file to cloudinary", file);
      try {
            if (!file) return null;

            const res = await cloudinary.uploader.upload(file, {
                  resource_type: "auto",
            });
            fs.unlinkSync(file);

            return res;
      } catch (error) {
            fs.unlinkSync(file);
            console.log("Error uploading file to cloudinary", error);
            return null;
      }
};

const deleteFileCloudinary = async (publicID, resourceType) => {
      try {
            if (!publicID) return null;

            const res = await cloudinary.uploader.destroy(publicID, {
                  resource_type: resourceType,
            });

            return res;
      } catch (error) {
            console.log("Error deleting file from cloudinary", error);
            return null;
      }
};

export { uploadFileCloudinary, deleteFileCloudinary };