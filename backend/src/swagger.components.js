/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e4567"
 *         firstName:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "John"
 *             ar:
 *               type: string
 *               example: "جون"
 *         lastName:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "Doe"
 *             ar:
 *               type: string
 *               example: "دو"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         username:
 *           type: string
 *           example: "john.doe"
 *         role:
 *           type: string
 *           enum: [user, admin, super-admin]
 *           example: "user"
 *         image:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "https://example.com/profile.jpg"
 *             key:
 *               type: string
 *               example: "uploads/profiles/profile123.jpg"
 *         isEmailVerified:
 *           type: boolean
 *           example: true
 *         calorieGoal:
 *           type: number
 *           example: 2000
 *         proteinGoal:
 *           type: number
 *           example: 150
 *         carbGoal:
 *           type: number
 *           example: 250
 *         fatGoal:
 *           type: number
 *           example: 67
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserHealthData:
 *       type: object
 *       properties:
 *         height:
 *           type: string
 *           example: "175"
 *           description: Height in centimeters
 *         weight:
 *           type: string
 *           example: "70"
 *           description: Weight in kilograms
 *         activityLevel:
 *           type: string
 *           enum: [sedentary, light, moderate, active, veryActive]
 *           example: "moderate"
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           example: "male"
 *         dob:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         bmr:
 *           type: number
 *           example: 1650
 *           description: Basal Metabolic Rate
 *         tdee:
 *           type: number
 *           example: 2200
 *           description: Total Daily Energy Expenditure
 *         calorieGoal:
 *           type: number
 *           example: 2200
 *         proteinGoal:
 *           type: number
 *           example: 137
 *         fatGoal:
 *           type: number
 *           example: 73
 *         carbGoal:
 *           type: number
 *           example: 247
 *         sugarGoal:
 *           type: number
 *           example: 55
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "SecurePass123!"
 *
 *     SignupRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "SecurePass123!"
 *
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e8888"
 *         content:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "Great recipe!"
 *             ar:
 *               type: string
 *               example: "وصفة رائعة!"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         recipe:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e4567"
 *         parent:
 *           type: string
 *           nullable: true
 *           example: null
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     MealPlan:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e9999"
 *         user:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e4567"
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         mealPlan:
 *           type: object
 *           properties:
 *             Breakfast:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["60c72b2f5f1b2c001f3e4567"]
 *             Lunch:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["60c72b2f5f1b2c001f3e4568"]
 *             Dinner:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["60c72b2f5f1b2c001f3e4569"]
 *             Snacks:
 *               type: array
 *               items:
 *                 type: string
 *               example: []
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ShoppingList:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e1111"
 *         listName:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "Weekly Shopping"
 *             ar:
 *               type: string
 *               example: "تسوق أسبوعي"
 *         list:
 *           type: array
 *           items:
 *             type: string
 *           example: ["60c72b2f5f1b2c001f3e1234", "60c72b2f5f1b2c001f3e1235"]
 *         recipeId:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e4567"
 *         user:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e4567"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e2222"
 *         name:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "Dinner"
 *             ar:
 *               type: string
 *               example: "عشاء"
 *         image:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "https://example.com/category.jpg"
 *             key:
 *               type: string
 *               example: "uploads/categories/category123.jpg"
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           description: Response data (varies by endpoint)
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         success:
 *           type: boolean
 *           example: true
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         statusCode:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: "Error description"
 *
 *     Ingredient:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64c25f59d03ac204a8f3ed34"
 *         name:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "Tomato"
 *             ar:
 *               type: string
 *               example: "طماطم"
 *         unit:
 *           type: string
 *           example: "piece"
 *         image:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "https://example.com/tomato.jpg"
 *             key:
 *               type: string
 *               example: "uploads/ingredients/tomato123.jpg"
 *         category:
 *           type: string
 *           example: "Vegetable"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Tag:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e5555"
 *         location:
 *           type: string
 *           example: "header"
 *           description: Where the tag should be placed
 *         script:
 *           type: string
 *           example: "<script>console.log('Hello');</script>"
 *           description: The script/tag content
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: "active"
 *           description: Tag status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NutritionComponent:
 *       type: object
 *       properties:
 *         name:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "Protein"
 *             ar:
 *               type: string
 *               example: "بروتين"
 *         amount:
 *           type: number
 *           example: 25.5
 *         unit:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "grams"
 *             ar:
 *               type: string
 *               example: "جرام"
 *         percentOfDailyNeeds:
 *           type: number
 *           example: 34.7
 *
 *     Nutrition:
 *       type: object
 *       properties:
 *         nutrients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NutritionComponent'
 *         glycemixIndex:
 *           type: number
 *           example: 45
 *         glycemicLoad:
 *           type: number
 *           example: 12.3
 *         nutritionBalanceScore:
 *           type: number
 *           example: 87
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e4567"
 *         title:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "Grilled Chicken"
 *             ar:
 *               type: string
 *               example: "دجاج مشوي"
 *         slug:
 *           type: string
 *           example: "grilled-chicken"
 *         description:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               example: "A delicious grilled chicken recipe."
 *             ar:
 *               type: string
 *               example: "وصفة دجاج مشوي لذيذة."
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               details:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f3e1234"
 *               nameClean:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: "chicken breast"
 *                   ar:
 *                     type: string
 *                     example: "صدر دجاج"
 *               ingrText:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: "2 boneless chicken breasts"
 *                   ar:
 *                     type: string
 *                     example: "2 صدور دجاج بدون عظم"
 *               amount:
 *                 type: number
 *                 example: 2
 *               unit:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: "pieces"
 *                   ar:
 *                     type: string
 *                     example: "قطع"
 *         nutrition:
 *           $ref: '#/components/schemas/Nutrition'
 *         instructions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               step:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: "Preheat the grill."
 *                   ar:
 *                     type: string
 *                     example: "سخن الشواية."
 *               image:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     example: "https://example.com/image.jpg"
 *                   key:
 *                     type: string
 *                     example: "uploads/instructions/image123.jpg"
 *         servings:
 *           type: number
 *           example: 4
 *         time:
 *           type: number
 *           example: 45
 *         cuisine:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               en:
 *                 type: string
 *                 example: "American"
 *               ar:
 *                 type: string
 *                 example: "أمريكي"
 *         category:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               en:
 *                 type: string
 *                 example: "Dinner"
 *               ar:
 *                 type: string
 *                 example: "عشاء"
 *         healthLabels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               en:
 *                 type: string
 *                 example: "Low-Fat"
 *               ar:
 *                 type: string
 *                 example: "قليل الدهون"
 *         dietLabels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               en:
 *                 type: string
 *                 example: "Keto"
 *               ar:
 *                 type: string
 *                 example: "كيتو"
 *         thumbnail:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "https://example.com/thumb.jpg"
 *             key:
 *               type: string
 *               example: "uploads/thumbnails/thumb123.jpg"
 *         views:
 *           type: number
 *           example: 134
 *         otherImages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com/image2.jpg"
 *               key:
 *                 type: string
 *                 example: "uploads/images/img2.jpg"
 *         videoUrl:
 *           type: string
 *           example: "https://youtube.com/watch?v=xyz123"
 *         metadata:
 *           type: object
 *           properties:
 *             imported:
 *               type: boolean
 *               example: true
 *             site:
 *               type: string
 *               example: "example.com"
 *             originalUrl:
 *               type: string
 *               example: "https://example.com/recipe/123"
 *             importDate:
 *               type: string
 *               format: date-time
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *             example: "60c72b2f5f1b2c001f3e9999"
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *             example: "60c72b2f5f1b2c001f3e8888"
 *         createdBy:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e7777"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
