import express from 'express';
import { AuthRouter } from './routes/auth';

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());

// Role of Router: Handle HTTP-specific details (e.g., parsing the request, setting response codes and headers).
app.use('/auth', AuthRouter)
// app.use('/api, apiRoutes)

//start program.
app.listen(PORT, () => console.log(`running app server listening on port ${PORT}`));
