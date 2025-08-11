import { Router } from "express";
import { upload } from "../../Middleware/multer.middleware.js";
import { isAuthenticated } from "../../Middleware/auth.middleware.js";
import { ImageUploadController } from "../../Controller/ImageUpload/Image.controller.js";


const router = Router();

/**
 * @swagger
 * /image/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Image]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: "https://s3.amazonaws.com/bucket/image.jpg"
 *                         key:
 *                           type: string
 *                           example: "uploads/temp/image.jpg"
 *       400:
 *         description: File not uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to upload image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/upload").post(
      isAuthenticated,
      upload.single("image"),
      ImageUploadController
);


export default router;