import { mongoose } from './connection'
import { city } from '../models/city.mjs'

const connection = mongoose.connection

function checkCity(cityName) {
  //check if city is prestent in DB

  let result = await city.find({ name: cityName })
   
  console.log(result)

}
