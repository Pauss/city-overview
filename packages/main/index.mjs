import express from 'express'
import {} from 'dotenv/config.js'
import Debug from 'debug'

import { connection } from 'db'
import { displayRestaurants } from 'maps-api'

const app = express()

const port = process.env.PORT || 3000

const debug = Debug('main')

app.get('/', (req, res) => {
  res.send('Hello World')
})

debug(connection.name)
await displayRestaurants()

app.listen(port, () => debug(`Listening on port ${port}...`))
