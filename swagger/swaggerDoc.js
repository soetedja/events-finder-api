const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  info: {
    title: 'MySQL Registration Swagger API',
    version: '1.0.0',
    description: 'Endpoints to test the user registration routes'
  },
  // host: 'localhost:3003',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header'
    }
  }
};
const options = {
  swaggerDefinition,
  apis: ['routes/*.route.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
