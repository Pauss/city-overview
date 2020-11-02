import { mongoose } from '../src/connection.js'

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxLength: 255
  },
  formatted_address: {
    type: String,
    required: true
  },
  business_status: String,
  permanently_closed: Boolean,
  opening_hours: [Object],
  geometry: Object,
  photos: [Object],
  place_id: {
    type: String,
    required: true
  },
  plus_code: Object,
  rating: Number,
  user_ratings_total: Number,
  price_level: Number,
  types: [String]
})

export { placeSchema }
