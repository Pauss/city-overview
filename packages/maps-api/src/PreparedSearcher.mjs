import {} from 'dotenv/config.js'
import { Searcher } from './Searcher.mjs'
import { City } from 'db'
import { fakeCity } from './fakeCity.mjs'
import { fakePlaces } from './fakePlaces.mjs'
import { placeKeys } from './place_keysAndTypes.mjs'

class PreparedSearcher extends Searcher {
  city = []
  places = []
  hotels = [{}]
  fakeCity = [{}]
  fakePlaces = []
  fakeHotels = []
  cityComplete = new City()._doc

  fakeApiCall() {
    this.fakeCity = fakeCity

    this.fakePlaces = fakePlaces

    this.fakeHotels = fakePlaces
  }

  async makeAPICall() {
    //await this.findCity()
    //await this.findPlaces()
    //await this.findHotels()
  }

  checkPlace(place) {
    let { formatted_address } = place

    const name = this.cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const regex = new RegExp(name, 'g')

    const norm_address = formatted_address.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    if (norm_address.match(regex) != null) return place
  }

  async verifyAPIResult() {
    await this.makeAPICall()

    const regex = new RegExp(this.cityName, 'g')

    //TODO : check if results > 0 , check if results > 1, make a sepparate function to check if place is form city input

    if (this.cityInfo.placeData.results === undefined) {
      this.city = []
    } else if (this.cityInfo.placeData.results.length > 1) {
      let cityResult = this.cityInfo.placeData.results.filter((place) => {
        return this.checkPlace(place)
      })
      this.city = cityResult
    } else if (this.cityInfo.placeData.results.length === 1) {
      this.city.push(this.checkPlace(this.cityInfo.placeData.results[0]))
    }

    // let placesResult = []
    // this.placesInfo.forEach((placeInfo) => {
    //   //todo Check if results is gratter than 1
    //   placesResult = placeInfo.placeData.results.filter((place) => {
    //     let norm = place.formatted_address
    //     norm = norm.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    //     if (norm.match(regex) != null) return place
    //   })
    //   this.places.push({ placeType: placeInfo.placeType, placeData: placesResult })
    // })

    // if (this.hotlesInfo.placeData.results.length > 1) {
    //   let hotlesResult = this.cityInfo.placeData.results.filter((place) => {
    //     let norm = place.formatted_address
    //     norm = norm.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    //     if (norm.match(regex) != null) return place
    //   })
    //   this.city = hotlesResult
    // } else {
    //   this.city = this.hotelsInfo.placeData.results
    // }
  }

  composeCityForDB() {
    this.cityComplete.name = this.cityName

    if (this.city.length) {
      let objectCity = this.city[0]

      Object.keys(objectCity).forEach((key) => {
        this.cityComplete[key] = objectCity[key]
      })
    }

    // let objectPlaces = this.places

    // Object.keys(this.cityComplete).forEach((key) => {
    //   if (placeKeys.includes(key)) {
    //     objectPlaces.forEach((place) => {
    //       this.cityComplete[key].push(place)
    //     })
    //   }
    // })

    // this.cityComplete.hotels = this.hotels

    //console.log(JSON.stringify(this.cityComplete, null, 2))
    console.log(this.cityComplete)
  }
}

export { PreparedSearcher }
