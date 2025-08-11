import express from "express";
import cookieParser from "cookie-parser";
import cors from "./Configs/cors.config.js";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

import passport from "./Configs/passport.js";
import helmetConfig from "./Configs/helmetConfig.js";
import swaggerUi from "swagger-ui-express";
import rateLimit from 'express-rate-limit';


dotenv.config(); // Load environment variables

const app = express();

// Middleware setup

const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,  // 15 minutes
      max: 100,                  // limit each IP to 100 requests per windowMs
      standardHeaders: true,     // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false,      // Disable the `X-RateLimit-*` headers
      message: {
            status: 429,
            message: "Too many requests from this IP, please try again after 15 minutes"
      }
});
// if (process.env.NODE_ENV === 'production') {
//       app.use(globalLimiter);
// }

app.use(helmetConfig); // Secure HTTP headers
app.use(passport.initialize()); // Initialize passport
app.use(morgan("dev")); // HTTP request logger
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(cors);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const __dirname = path.resolve();

// Routes import
import userRoutes from "./Routes/user/user.routes.js";
import testRoutes from "./Routes/testing/testing.routes.js";
import recipeRoute from "./Routes/recipe/recipe.routes.js";
import imageRoute from "./Routes/image/image.routes.js";
import { errorMiddleware } from "./Middleware/error.js";
import categoryRoutes from "./Routes/category/category.routes.js";
import followRoute from "./Routes/Follow/Follow.routes.js";
import saveRecipeRoute from "./Routes/SaveRecipes/SaveRecipeToUser.routes.js";
import ingredientRoutes from "./Routes/ingredients/ingredients.routes.js";
import likeRoute from "./Routes/RecipeLiked/liked.routes.js";
import commentRoutes from "./Routes/comment/comment.routes.js";
import searchRoute from "./Routes/search/search.routes.js";
import queryParamsRoute from "./Routes/queryParmas/queryParmas.routes.js";
import mealPlannerRoutes from "./Routes/MealPlanner/mealPlanner.routes.js";
import listRoute from "./Routes/List/list.routes.js"
import tagRoutes from "./Routes/tags/tags.routes.js";
import swaggerSpec from "./swagger.js";


// Swagger route
app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                  withCredentials: true,
            },
      })
);
// Routes setup
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/testing", testRoutes);
app.use("/api/v1/recipe", recipeRoute);
app.use("/api/v1/image", imageRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/follow", followRoute);
app.use("/api/v1/recipe-user", saveRecipeRoute);
app.use("/api/v1/ingredient", ingredientRoutes);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/query", queryParamsRoute);
app.use("/api/v1/meal-planner", mealPlannerRoutes);
app.use("/api/v1/list", listRoute)
app.use("/api/v1/tags", tagRoutes);

// Global Error Handling Middleware
app.use(errorMiddleware);

// 404 Handler
app.use((req, res) => {
      res.status(404).json({ message: "Route Not Found" });
});

export { app };
