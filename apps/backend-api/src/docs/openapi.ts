import path from 'node:path';
import swaggerJSDoc, { type Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'InterviewPrep API',
      version: '1.0.0',
      description:
        'REST API for the InterviewPrep platform, covering authentication, problem discovery, submissions, analytics, and admin workflows.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Liveness and readiness probes' },
      { name: 'Auth', description: 'Email/password and GitHub-based authentication flows' },
      { name: 'Problems', description: 'Problem catalog, daily challenge, and hint generation' },
      { name: 'Submissions', description: 'Run code, submit solutions, and fetch results' },
      { name: 'Dashboard', description: 'User analytics and recent activity' },
      { name: 'Admin', description: 'Administrative problem and test-case management' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, 'swagger.ts')],
};

export const swaggerSpec = swaggerJSDoc(options);
