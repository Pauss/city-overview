import { mongoose } from '../src/connection.js'
import { placeSchema } from './place.js'

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  formatted_address: {
    type: String,
    required: true
  },
  geometry: [Object],
  photos: [Object],
  place_id: String,
  types: [String],
  restaurants: [placeSchema],
  hotels: [placeSchema],
  hospitals: [placeSchema],
  airports: [placeSchema],
  banks: [placeSchema],
  fire_station: [placeSchema],
  museums: [placeSchema],
  movie_theaters: [placeSchema],
  parks: [placeSchema],
  secondary_schools: [placeSchema],
  shopping_malls: [placeSchema],
  supermarkets: [placeSchema],
  tourist_attraction: [placeSchema],
  universities: [placeSchema],
  zoo: [placeSchema],
  created: {
    type: Date,
    default: Date.now
  }
})

let City = mongoose.model('City', citySchema)
export { City }
