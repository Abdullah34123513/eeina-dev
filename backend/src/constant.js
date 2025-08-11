import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const DB_NAME = process.env.DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;

// Cloudinary
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

// AWS S3
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Edamam API
export const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
export const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
export const EDAMAM_USER_ID = process.env.EDAMAM_USER_ID;
export const RECIPE_SCRAPER_URL = process.env.RECIPE_SCRAPER_URL;

// Spoonacular API
export const SPOONACULAR_API_KEY = process.env.RECIPE_API;


//DeepL API
export const DEEPL_AUTH_KEY = process.env.DEEPL_AUTH_KEY; // Replace with your actual DeepL API key
