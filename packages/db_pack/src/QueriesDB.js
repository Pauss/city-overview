import { mongoose } from './connection.js'
import { City } from '../models/city.js'
import Debug from 'debug'

const debug = Debug('db-queries')

const connection = mongoose.connection

class QueriesDB {
  async checkCityInDB(cityName) {
    //check if city is present in DB
    let result = await City.find({ name: cityName })
    if (result.length) return true
    return false
  }

  async addCity(cityObject) {
    let newCity = new City(cityObject)

    const result = await newCity.save()
    return result
  }
}

let queriesDB = new QueriesDB()

export { queriesDB }
