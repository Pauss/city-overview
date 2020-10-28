import axios from 'axios'
import {} from 'dotenv/config.js'
import { Searcher } from './Searcher.mjs'
import { City } from 'db'

const search = new Searcher('Suceava')
async function displayCity() {
  const infoCity = await search.findCity()
  console.log('City info: ', infoCity)
  const result = await City.create(infoCity.results[0])
  console.log('Added new city', result)

  // const infoPlaces = await search.findPlace()
  // console.log('Places info: ', JSON.stringify(infoPlaces, null, 2))
  //const infoHotels = await search.findHotles()
  //console.log('Hotels info', JSON.stringify(infoHotels, null, 2))
}

export { displayCity }
