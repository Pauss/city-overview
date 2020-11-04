import express from 'express'
import {} from 'dotenv/config.js'
import Debug from 'debug'
import { requestCity } from './src/core.js'

const app = express()

const port = process.env.PORT || 3000

const debug = Debug('main')

app.get('/', (req, res) => {
  res.send('Hello World')
})

await requestCity('Iasi')

app.listen(port, () => debug(`Listening on port ${port}...`))
