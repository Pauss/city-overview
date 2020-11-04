import {} from 'dotenv/config.js'
import { Searcher } from './Searcher.js'
import { City } from 'db_pack'
import deepcopy from 'deepcopy'
import { fakeCity } from './fakeCity.js'
import { fakePlaces } from './fakePlaces.js'
import { placeKeysTypes } from './place_keysAndTypes.js'
import Debug from 'debug'

const debug = Debug('maps-api-prepared')

const APICall = {
  NO_RESULTS: 0,
  ONE_RESULT: 1,
  MANY_RESULTS: 2
}

const MAX_API_RESULTS = 20

class PreparedSearcher extends Searcher {
  city = []
  places = []
  hotels = []
  onePlace = []
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

  async filterAPICityResult() {
    if (this.cityInfo.placeData) {
      const resultsNumber = this.checkResultsNumber(this.cityInfo.placeData.results)

      switch (resultsNumber) {
        case APICall.NO_RESULTS:
          break
        case APICall.ONE_RESULT:
          this.cityInfo.placeData.results[0] = deepcopy(this.checkInCity(this.cityInfo.placeData.results[0]))
          break
        case APICall.MANY_RESULTS:
          let res = this.cityInfo.placeData.results.filter((place) => {
            return this.checkInCity(place)
          })
          this.cityInfo.placeData.results = deepcopy(res)
          break
        default:
          break
      }
    }
  }

  async filterAPIPlacesResult() {
    if (this.placesInfo) {
      this.placesInfo.forEach((place, index) => {
        const resultsNumber = this.checkResultsNumber(place.placeData.results)

        switch (resultsNumber) {
          case APICall.NO_RESULTS:
            break
          case APICall.ONE_RESULT:
            place.placeData.results[0] = deepcopy(this.checkInCity(place.placeData.results[0]))
            break
          case APICall.MANY_RESULTS:
            let res = place.placeData.results.filter((oneplace) => {
              return this.checkInCity(oneplace)
            })
            place.placeData.results = deepcopy(res)
            break
          default:
            break
        }
      })
    }
  }

  async filterAPIHotelsResult() {
    if (this.hotelsInfo.placeData) {
      const resultsNumber = this.checkResultsNumber(this.hotelsInfo.placeData.results)

      switch (resultsNumber) {
        case APICall.NO_RESULTS:
          break
        case APICall.ONE_RESULT:
          this.hotelsInfo.placeData.results[0] = deepcopy(this.checkInCity(this.hotelsInfo.placeData.results[0]))
          break
        case APICall.MANY_RESULTS:
          let res = this.hotelsInfo.placeData.results.filter((place) => {
            return this.checkInCity(place)
          })
          this.hotelsInfo.placeData.results = deepcopy(res)
          break
        default:
          break
      }
    }
  }

  async filterAPIOnePlaceResult() {
    if (this.onePlaceInfo.placeData) {
      const resultsNumber = this.checkResultsNumber(this.onePlaceInfo.placeData.results)

      switch (resultsNumber) {
        case APICall.NO_RESULTS:
          break
        case APICall.ONE_RESULT:
          this.onePlace.placeData.results[0] = deeepcopy(this.checkInCity(this.onePlaceInfo.placeData.results[0]))
          break
        case APICall.MANY_RESULTS:
          let res = this.onePlaceInfo.placeData.results.filter((place) => {
            return this.checkInCity(place)
          })
          this.onePlaceInfo.placeData.results = deepcopy(res)
          break
        default:
          break
      }
    }
  }

  async checkPlacesCompletness() {
    if (this.placesInfo) {
      this.places = deepcopy(this.placesInfo)

      for (let index = 0; index < this.places.length; index++) {
        while (
          this.places[index].placeData.results.length === MAX_API_RESULTS &&
          this.places[index].placeData.next_page_token !== undefined
        ) {
          const token = this.places[index].placeData.next_page_token
          const myType = this.places[index].placeType

          await sleep(2000)

          await this.findOnePlace(myType, token)

          //let thisOnePlaceInfo = deepcopy(this.onePlaceInfo)

          await this.filterAPIOnePlaceResult() //modifies this.onePlaceInfo

          let copy = deepcopy(this.places[index].placeData.results)

          this.places[index] = deepcopy(this.onePlaceInfo)

          let fullCopy = this.places[index].placeData.results.concat(copy)

          this.places[index].placeData.results = deepcopy(fullCopy)

          debug(this.places[index].placeData.results.length)
        }
      }
    }
  }

  async checkHotelsCompletness() {
    if (this.hotelsInfo.placeData) {
      this.hotels = deepcopy(this.hotelsInfo)

      while (this.hotels.placeData.results.length >= MAX_API_RESULTS && this.hotels.placeData.next_page_token !== undefined) {
        const token = this.hotels.placeData.next_page_token

        await sleep(2000)

        await this.findMoreHotels(token) //add into moreHotelsInfo

        let thisHotelsCopyResults = deepcopy(this.hotels.placeData.results)

        this.hotels = deepcopy(this.moreHotelsInfo)

        debug(this.moreHotelsInfo)

        this.hotelsInfo = deepcopy(this.moreHotelsInfo)

        await this.filterAPIHotelsResult() //change this.hotelsInfo

        let fullCopy = thisHotelsCopyResults.concat(this.hotelsInfo.placeData.results)

        this.hotels.placeData.results = deepcopy(fullCopy)

        debug('results length : ', this.hotels.placeData.results.length)
      }
    }
  }

  async composeCityForDB() {
    const normName = this.cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    this.cityComplete.name = normName

    if (this.cityInfo.placeData) {
      this.city = deepcopy(this.cityInfo)

      if (this.city.placeData.results.length) {
        let objectCity = this.city.placeData.results[0]

        Object.keys(objectCity).forEach((key) => {
          this.cityComplete[key] = objectCity[key]
        })
      }
    }

    if (this.placesInfo) {
      Object.keys(this.cityComplete).forEach((key) => {
        if (Object.keys(placeKeysTypes).includes(key)) {
          let matchedKey = placeKeysTypes[key]
          this.places.forEach((place) => {
            if (matchedKey === place.placeType) {
              this.cityComplete[key] = deepcopy(place.placeData.results)
            }
          })
        }
      })
    }

    if (this.hotels.placeData) {
      this.hotels.placeData.results.forEach((hotel, index) => {
        this.cityComplete.hotels[index] = deepcopy(hotel)
      })
    }
    debug(this.cityComplete)
  }
}

export { PreparedSearcher }

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
