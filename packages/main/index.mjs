import express from 'express'
import {} from 'dotenv/config.js'
import Debug from 'debug'

import { PreparedSearcher } from 'maps-api'

const app = express()

const port = process.env.PORT || 3000

const debug = Debug('main')

app.get('/', (req, res) => {
  res.send('Hello World')
})

const prepareSearch = new PreparedSearcher('Falticeni')
await prepareSearch.verifyAPIResult()
prepareSearch.composeCityForDB()

app.listen(port, () => debug(`Listening on port ${port}...`))
