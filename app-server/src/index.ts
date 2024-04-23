import express from 'express'
import { AuthRouter } from './routes/auth'
import { ApiRouter } from './routes/api'
import { Database } from './database/db'

const app = express()

// middleware
app.use(express.json())

// routes
app.use('/auth', AuthRouter) // authorize use of our app
app.use('/api', ApiRouter) // access the api

// start program
app.listen(80, async () => {
  try {
    await Database.initializeDatabase()
    console.log(`running app server listening on port 80`)
  } catch (error) {
    console.error('Could not start the app.')
  }
})
