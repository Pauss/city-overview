//get request

//get data from api || DB (if data already exists)

//if data is taken from API then update DB

//if a year passed// update data from DB

//function get data
// if city in DB => get form DB
// else
// findCity -> verify City -> findPlaces -> verifyPlaces -> check placesCompletness -> findHotles -> verifyHotels -> check hotelsCompletness -> composeCity -> save to DB => get from DB

import { PreparedSearcher } from 'maps-api'
import { queriesDB } from 'db_pack'
import Debug from 'debug'

const debug = Debug('main-core')

async function createApiCity(cityName) {
  const preparedSearch = new PreparedSearcher(cityName)

  //find city and all places:
  try {
    // 1.find city and all places:
    await preparedSearch.findCity()
    await preparedSearch.findPlaces()
    await preparedSearch.findHotels()

    // 2.filter results:
    await preparedSearch.filterAPICityResult()
    await preparedSearch.filterAPIPlacesResult()
    await preparedSearch.filterAPIHotelsResult()

    // 3.do more API calls where more than one API call is needed (API returns only 20 rows)
    await preparedSearch.checkPlacesCompletness()
    await preparedSearch.checkHotelsCompletness()

    // 4.bring all data in one place
    await preparedSearch.composeCityForDB()

    // 5. city is available in preparedSearch.cityComplete
    return preparedSearch.cityComplete
  } catch (err) {
    debug('Erros when create APICity')
  }
}

async function requestCity(cityName) {
  const inDB = await queriesDB.checkCityInDB(cityName)
  console.log('City in DB: ', inDB)

  if (inDB === false) {
    const newCity = await createApiCity(cityName)
    //const newCity = { name: 'Suceava', formatted_address: 'Suceava' }
    const result = await queriesDB.addCity(newCity)
    debug(result)
  }
}

export { requestCity }
