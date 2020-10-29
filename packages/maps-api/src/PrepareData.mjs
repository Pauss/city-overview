import axios from 'axios'
import {} from 'dotenv/config.js'
import { Searcher } from './Searcher.mjs'
import { City } from 'db'

// const search = new Searcher('Suceava')
// async function displayCity() {
//   // const infoCity = await search.findCity()
//   // console.log('City info: ', infoCity)
//   // const result = await City.create(infoCity.results[0])
//   // console.log('Added new city', result)
//   // const infoPlaces = await search.findPlace()
//   // console.log('Places info: ', JSON.stringify(infoPlaces, null, 2))
//   //const infoHotels = await search.findHotles()
//   //console.log('Hotels info', JSON.stringify(infoHotels, null, 2))
// }

// export { displayCity }

const search = new Searcher('Suceava')
let cityData = {}

async function getAndDisplayData() {
  // await search.findCity()
  // const cityInfo = search.getCityInfo()
  // console.log('City info: ', JSON.stringify(cityInfo, null, 2))

  await search.findPlaces()
  let placesInfo = search.getPlacesInfo()
  console.log('Places info: ', JSON.stringify(placesInfo, null, 2))

  //   console.log('#############################')

  //   console.log(typeof placesInfo)

  //   placesInfo.forEach(async (place) => {
  //     if (place.next_page_token) {
  //       const result = await search.findOnePlace(place.results[0].types[0], place.next_page_token)
  //       console.log('nextPageFound: ', result)
  //     }
  //   })
}

//verify Data is complete: if data incomplete: call api again
//function veriftCompletness

//verify Data is correct (all places/ hotels are inside the city from input)

export { getAndDisplayData }
