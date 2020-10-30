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

  async verifyAPIResult() {
    await this.makeAPICall()

    const regex = new RegExp(this.cityName, 'g')

    if (this.cityInfo.placeData.results.length > 1) {
      let cityResult = this.cityInfo.placeData.results.filter((place) => {
        if (place.formatted_address.match(regex) != null) return place
      })
      this.city = cityResult
    } else {
      this.city = this.cityInfo.placeData.results
    }

    //this.placeInfo.placeData.results.filter

    let placesResult = []
    this.placesInfo.forEach((placeInfo) => {
      placesResult = placeInfo.placeData.results.filter((place) => {
        let norm = place.formatted_address
        norm = norm.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        if (norm.match(regex) != null) return place
      })
      this.places.push({ placeType: placeInfo.placeType, placeData: placesResult })
    })

    console.log(
      `length before filter: ${this.placesInfo[0].placeData.results.length} length after filter: ${this.places[0].placeData.length}`
    )
    this.places.forEach((place, index) => {
      console.log(`length before filter: ${this.placesInfo[index].placeData.results.length} length after filter: ${place.placeData.length}`)
      console.log(place.placeType, place.placeData)
    })

    // //this.hotlesInfo.results.filter
    // let hotelsResult = this.hotelsInfo.placeData.results.filter((place) => {
    //   if (place.formatted_address.match(regex) != null) return place
    // })
    // this.hotels = hotelsResult
  }

  composeCityForDB() {
    this.cityComplete.name = this.cityName

    let objectCity = this.city[0]

    Object.keys(objectCity).forEach((key) => {
      this.cityComplete[key] = objectCity[key]
    })

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
    //console.log(this.cityComplete)
  }
}

export { PreparedSearcher }
