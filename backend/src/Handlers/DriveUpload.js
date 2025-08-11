import { google } from "googleapis";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your service account JSON file
const KEYFILEPATH = path.join(__dirname, "../../eeina-test-501fcbef6b3c.json");

// Define the required scope (drive.file gives access to files created by your app)
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// Initialize Google Auth client
const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
});

// Create an instance of the Google Drive API
const drive = google.drive({ version: "v3", auth });

/**
 * Fetches an image from a remote URL as a stream and uploads it to Google Drive.
 * @param {string} imageUrl - The URL of the image to upload.
 * @returns {Promise<Object>} - An object containing fileId, webViewLink, and webContentLink.
 */
async function uploadFile(imageUrl) {
      try {
            if (!imageUrl) {
                  throw new Error("No image URL provided.");
            }

            // Fetch the image as a stream from the remote URL
            const response = await axios.get(imageUrl, { responseType: "stream" });
            const mimeType = response.headers["content-type"] || "image/jpeg";
            const fileExtension = mimeType.split("/")[1] || "jpg";
            const fileName = `uploaded-${Date.now()}.${fileExtension}`;

            // Prepare file metadata and media content
            const fileMetadata = { name: fileName };
            const media = { mimeType, body: response.data };

            // Upload the file to Google Drive
            const createResponse = await drive.files.create({
                  resource: fileMetadata,
                  media: media,
                  fields: "id",
            });

            const fileId = createResponse.data.id;

            // Make the uploaded file public (reader role for anyone)
            await drive.permissions.create({
                  fileId,
                  requestBody: {
                        role: "reader",
                        type: "anyone",
                  },
            });

            // Retrieve file links: webViewLink for preview and webContentLink for direct download
            const fileData = await drive.files.get({
                  fileId,
                  fields: "webViewLink, webContentLink",
            });

            return {
                  success: true,
                  fileId,
                  webViewLink: fileData.data.webViewLink,
                  webContentLink: fileData.data.webContentLink,
            };
      } catch (error) {
            console.error("Error uploading image:", error.message);
            throw error;
      }
}

// // Example usage
// async function main() {
//       // Example image object coming from a client (you can adjust as needed)
//       const imageURL = {
//             url: 'https://www.allrecipes.com/thmb/RacEAcoZoo6t1VtOo8H4eA9uX9U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/1655174722beef20crunchwrap2011-2000-886239a750714916b2999b6369048706.jpg',
//             public_id: 'placeholder'
//       };

//       try {
//             const result = await uploadFile(imageURL.url);
//             console.log('Upload result:', result);
//       } catch (error) {
//             console.error('Upload failed:', error.message);
//       }
// }

// main();

export default uploadFile;
