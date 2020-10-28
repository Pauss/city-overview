import mongoose from 'mongoose'
import Debug from 'debug'
import {} from 'dotenv/config.js'

const debug = Debug('mongoDB')

const db_connect = {
  url_db: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:${process.env.DB_PORT}/city-overview?authSource=admin`,
  params: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}

try {
  const connect = await mongoose.connect(db_connect.url_db, db_connect.params)
  debug('Connected to MongoDB...')
} catch (err) {
  debug('Could not connect to MongoDB...')
}

export { mongoose }
