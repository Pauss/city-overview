import {} from 'dotenv/config.js'
import { Searcher } from './Searcher.js'
import { City } from 'db_pack'
import deepcopy from 'deepcopy'
import { fakeCity } from './fakeCity.js'
import { fakePlaces } from './fakePlaces.js'
import { placeKeys } from './place_keysAndTypes.js'

const APICall = {
  NO_RESULTS: 0,
  ONE_RESULT: 1,
  MANY_RESULTS: 2
}

class PreparedSearcher extends Searcher {
  city = []
  places = []
  hotels = []
  cityComplete = new City()._doc

  checkInCity(place) {
    let { formatted_address } = place

    const name = this.cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const regex = new RegExp(name, 'g')
    const norm_address = formatted_address.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    if (norm_address.match(regex) != null) return place
  }

  checkResultsNumber(results) {
    if (results === undefined) return APICall.NO_RESULTS
    else if (results.length === 1) return APICall.ONE_RESULT
    else if (results.length > 1) return APICall.MANY_RESULTS
  }

  async checkPlacesCompletness() {
    await this.findPlaces()
    let results = await this.verifyAPIPlacesResult()

    results.forEach()

    //while foreach place there are more then 20 valid outputs
    //recall the API and do the checks
    //after each recall and verified output add to this.places the valid data
  }

  async verifyAPICityResult() {
    await this.findCity()

    const resultsNumber = this.checkResultsNumber(this.cityInfo.placeData.results)

    switch (resultsNumber) {
      case APICall.NO_RESULTS:
        return []

      case APICall.ONE_RESULT:
        return this.checkInCity(this.cityInfo.placeData.results[0])

      case APICall.MANY_RESULTS:
        let results = this.cityInfo.placeData.results.filter((place) => {
          return this.checkInCity(place)
        })
        return results

      default:
        break
    }
  }

  async verifyAPIPlacesResult() {
    await this.findPlaces()

    let results = []
    this.placesInfo.forEach((placeInfo, index) => {
      const resultsNumber = this.checkResultsNumber(placeInfo.placeData.results)

      switch (resultsNumber) {
        case APICall.NO_RESULTS:
          results = []
          return { placeType: placeKeys[index], placeData: results }

        case APICall.ONE_RESULT:
          results = this.checkInCity(this.placesInfo[index].placeData.results[0])
          return { placeType: placeKeys[index], placeData: results }

        case APICall.MANY_RESULTS:
          results = placeInfo.placeData.results.filter((place) => {
            return this.checkInCity(place)
          })
          return { placeType: placeKeys[index], placeData: results }

        default:
          break
      }
    })
  }

  async verifyAPIHotelsResult() {
    //await this.findHotels()

    const resultsNumber = this.checkResultsNumber(this.hotelsInfo.placeData.results)

    switch (resultsNumber) {
      case APICall.NO_RESULTS:
        return []

      case APICall.ONE_RESULT:
        return this.checkInCity(this.hotelsInfo.placeData.results[0])

      case APICall.MANY_RESULTS:
        let results = this.hotelsInfo.placeData.results.filter((place) => {
          return this.checkInCity(place)
        })
        return results

      default:
        break
    }
  }

  async composeCityForDB() {
    this.cityComplete.name = this.cityName

    this.city = await this.verifyAPICityResult()

    if (this.city.length) {
      let objectCity = this.city[0]

      Object.keys(objectCity).forEach((key) => {
        this.cityComplete[key] = objectCity[key]
      })
    }

    let objectPlaces = this.places

    Object.keys(this.cityComplete).forEach((key) => {
      objectPlaces.forEach((place) => {
        if (key === place.placeType) {
          this.cityComplete[key] = deepcopy(place.placeData)
        }
      })
    })

    if (this.hotels.length) {
      this.hotels.forEach((hotel, index) => {
        this.cityComplete.hotels[index] = deepcopy(hotel)
      })
    }

    //console.log(JSON.stringify(this.cityComplete, null, 2))
    console.log(this.cityComplete)
  }
}

export { PreparedSearcher }
