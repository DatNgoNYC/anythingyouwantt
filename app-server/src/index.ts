// main app
import express from 'express';
import http from 'http';

// import the routers here
// import authRoute from ./routes/authRoute
// import //

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
// app.use('/api, apiRoutes)
// app.use('/auth, authRoute)

app.listen(PORT, () => console.log(`running app server listening on port ${PORT}`));
