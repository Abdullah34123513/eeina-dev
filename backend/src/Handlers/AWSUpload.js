import axios from "axios";
import AWS from "aws-sdk";
import { PassThrough } from "stream";
import fs from "fs";
import path from "path";
import {
      AWS_ACCESS_KEY_ID,
      AWS_BUCKET_NAME,
      AWS_REGION,
      AWS_SECRET_ACCESS_KEY,
} from "../constant.js";

// Configure AWS S3
const s3 = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
      signatureVersion: "v4",
});

const bucketName = AWS_BUCKET_NAME; // Your S3 bucket name

// Function to upload image from URL to S3
const uploadImageFromUrl = async (imageUrl, urlTitle) => {
      const fileName = urlTitle.replace(/ /g, "-");

      const key = `uploads/importURL/${fileName}.jpg`; // File name in S3 in Uploads folder
      try {
            // Fetch the image as a stream
            const response = await axios({
                  url: imageUrl,
                  method: "GET",
                  responseType: "stream",
            });

            // Create a PassThrough stream to send data to S3
            const passThroughStream = new PassThrough();
            response.data.pipe(passThroughStream);

            // Upload to S3
            const uploadParams = {
                  Bucket: bucketName,
                  Key: key, // File name in S3
                  Body: passThroughStream,
                  ContentType: response.headers["content-type"],
            };

            const uploadResult = await s3.upload(uploadParams).promise();
            return uploadResult; // Returns the S3 URL of the uploaded image
      } catch (error) {
            console.error("Error uploading image:", error.message);
            throw error;
      }
};

// Upload media from user device to S3
const uploadMediaUserDevice = async (path, filename, location = "uploads/device") => {
      try {
            // Read file from disk
            const fileContent = fs.readFileSync(path);

            // Set S3 upload parameters
            const params = {
                  Bucket: bucketName, // Your S3 bucket name
                  Key: `${location}/${filename}`, // File name in S3
                  Body: fileContent,
                  ACL: "public-read", // Make the file publicly accessible
                  ContentType: "image/jpeg", // Adjust based on file type
            };

            // Upload to S3
            const uploadResult = await s3.upload(params).promise();

            // Delete local file after upload (optional)
            fs.unlinkSync(path);

            return {
                  success: true,
                  imageUrl: uploadResult.Location,
                  key: uploadResult.Key,
            };
      } catch (error) {
            console.error("Error uploading to S3:", error);
            return { success: false, error: error.message };
      }
};

const deleteMedia = async (key) => {
      if (!key || typeof key !== "string") {
            return null;
      }
      try {
            // Set S3 delete parameters
            const params = {
                  Bucket: bucketName, // Your S3 bucket name
                  Key: key, // File key in S3
            };

            // Delete the object from S3
            await s3.deleteObject(params).promise();

            console.log("File deleted successfully:", key);
            return { success: true, message: "File deleted successfully" };
      } catch (error) {
            console.error("Error deleting from S3:", error);
            return { success: false, error: error.message };
      }
};

async function moveS3Objects(keysToMove, fromFolder = "temp", toFolder = "device") {
      const tasks = keysToMove.map(async (oldKey) => {
            console.log("Moving key:", oldKey);
            if (!oldKey || typeof oldKey !== "string") {
                  return null;
            }
            try {
                  const newKey = oldKey.replace(fromFolder, toFolder);

                  await s3
                        .copyObject({
                              Bucket: bucketName,
                              CopySource: `/${bucketName}/${encodeURIComponent(oldKey)}`,
                              Key: newKey,
                              ACL: "public-read", // adjust if needed
                        })
                        .promise();

                  await s3
                        .deleteObject({
                              Bucket: bucketName,
                              Key: oldKey,
                        })
                        .promise();

                  return {
                        key: newKey,
                        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`,
                  };
            } catch (error) {
                  return { success: false, oldKey, error: error.message || error.toString() };
            }
      });

      return Promise.all(tasks);
}

export { uploadImageFromUrl, uploadMediaUserDevice, deleteMedia, moveS3Objects };
