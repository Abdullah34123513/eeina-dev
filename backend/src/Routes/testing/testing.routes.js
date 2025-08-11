import { Router } from "express";
import fetch from "node-fetch";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * /testing:
 *   get:
 *     summary: Test endpoint for external API integration
 *     tags: [Testing]
 *     description: Test endpoint that fetches random recipes from Spoonacular API
 *     responses:
 *       200:
 *         description: Test data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Recipe data from external API
 *       500:
 *         description: External API error
 */
const testingControler = asyncHandler(async (req, res, next) => {
      const response = await fetch(
            "https://api.spoonacular.com/recipes/random?apiKey=8d6f9b72c20f412e9d0b56b15a72b490&number=20"
      );

      const data = await response.json();
      res.status(200).json(data);
});

router.get("/", testingControler);

export default router;
