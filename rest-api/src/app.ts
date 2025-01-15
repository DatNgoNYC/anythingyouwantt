import express from 'express';
import router from './routes/router.js';
import { authenticateUser as authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

// Middleware
app.use(express.json());
app.use(authenticate); // Authenticate globally except during registration (POST /user)

// Routing
app.use('/api', router); // Attach all API endpoints under the /api prefix

// Error Handler
app.use(errorHandler);

export default app;
