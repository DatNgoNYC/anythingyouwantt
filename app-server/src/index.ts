import express from 'express';
import { AuthRouter } from './routes/auth';
import { initializeDatabase } from './database/db';
import { ApiRouter } from './routes/api';

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());

app.use('/auth', AuthRouter)
app.use('/api', ApiRouter)

// start program.
initializeDatabase();
app.listen(PORT, () => console.log(`running app server listening on port ${PORT}`));
