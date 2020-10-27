import express from 'express'
import {} from 'dotenv/config.js'

import { connection } from '../db/connection.mjs'

const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})

console.log(connection.name)

app.listen(port, () => console.log(`Listening on port ${port}...`))
