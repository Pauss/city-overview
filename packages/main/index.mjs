import express from 'express'
import {} from 'dotenv/config.js'
import Debug from 'debug'

import { mongoose } from 'db'
import { displayCity } from 'maps-api'

const app = express()

const port = process.env.PORT || 3000

const debug = Debug('main')

app.get('/', (req, res) => {
  res.send('Hello World')
})

debug(mongoose.connection.name)
await displayCity()

app.listen(port, () => debug(`Listening on port ${port}...`))
