import { mongoose } from './connection.mjs'
import { City } from '../models/city.mjs'

const connection = mongoose.connection

class QueriesDB {
  constructor(cityName) {
    this.cityName = cityName
  }

  async checkCity(cityName) {
    //check if city is prestent in DB

    let result = await City.find({ name: cityName })
    if (result) return true
    return false
  }

  async addCity(cityObject) {
    const result = await checkCity('Suceava')
    console.log('City in DB : ', result)
  }
}
