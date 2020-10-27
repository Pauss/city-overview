import mongoose from 'mongoose'
import Debug from 'debug'
const debug = Debug('mongoDB:')

mongoose
  .connect('mongodb://localhost/DBNAME_TODO', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => debug('Connected to MongoDB...'))
  .catch((err) => debug('Could not connect to MongoDB...'))

const connection = mongoose.connection

export { connection }
