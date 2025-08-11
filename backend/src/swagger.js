// src/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
      definition: {
            openapi: '3.0.0',
            info: {
                  title: 'EEINA Recipe API',
                  version: '1.0.0',
                  description: 'A comprehensive recipe management API with multilingual support (English/Arabic), social features, meal planning, and nutrition tracking.',
                  contact: {
                        name: 'EEINA API Support',
                        email: 'support@eeina.com'
                  },
                  license: {
                        name: 'ISC',
                        url: 'https://opensource.org/licenses/ISC'
                  }
            },
            servers: [
                  {
                        url: 'http://localhost:5050/api/v1',
                        description: 'Development server'
                  },
                  {
                        url: 'https://api.eeina.com/api/v1',
                        description: 'Production server'
                  },
            ],
            components: {
                  securitySchemes: {
                        cookieAuth: {
                              type: 'apiKey',
                              in: 'cookie',
                              name: 'accessToken',
                              description: 'JWT token stored in HTTP-only cookie'
                        }
                  }
            },
            security: [
                  {
                        cookieAuth: []
                  }
            ],
            tags: [
                  {
                        name: 'Authentication',
                        description: 'User authentication and authorization'
                  },
                  {
                        name: 'User',
                        description: 'User management and profiles'
                  },
                  {
                        name: 'Recipe',
                        description: 'Recipe management and operations'
                  },
                  {
                        name: 'Search',
                        description: 'Recipe search and filtering'
                  },
                  {
                        name: 'Social',
                        description: 'Social features like likes, follows, comments'
                  },
                  {
                        name: 'Meal Planning',
                        description: 'Meal planning and nutrition tracking'
                  },
                  {
                        name: 'Shopping Lists',
                        description: 'Shopping list management'
                  },
                  {
                        name: 'Ingredient',
                        description: 'Ingredient management'
                  },
                  {
                        name: 'Category',
                        description: 'Category and label management'
                  },
                  {
                        name: 'Admin',
                        description: 'Administrative operations'
                  },
                  {
                        name: 'Image',
                        description: 'Image upload and management'
                  },
                  {
                        name: 'Testing',
                        description: 'Testing and development endpoints'
                  }
            ]
      },
      // Note capitalized folder names and subfolders
      apis: ['./src/Routes/**/*.js','./src/swagger.components.js'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
