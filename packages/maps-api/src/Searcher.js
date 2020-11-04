import axios from 'axios'
import Debug from 'debug'

const debug = Debug('maps-api-searcher')

class Searcher {
  queryString = 'hotels'
  cityName = ''
  rootURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
  cityInfo = { placeType: 'city', placeData: {} }
  placesInfo = [
    { placeType: 'restaurant', placeData: {} },
    { placeType: 'hospital', placeData: {} },
    { placeType: 'airport', placeData: {} },
    { placeType: 'bank', placeData: {} },
    { placeType: 'fire_station', placeData: {} },
    { placeType: 'museum', placeData: {} },
    { placeType: 'movie_theater', placeData: {} },
    { placeType: 'park', placeData: {} },
    { placeType: 'secondary_school', placeData: {} },
    { placeType: 'university', placeData: {} },
    { placeType: 'shopping_mall', placeData: {} },
    { placeType: 'supermarket', placeData: {} },
    { placeType: 'zoo', placeData: {} },
    { placeType: 'tourist_attraction', placeData: {} }
  ]
  hotelsInfo = { placeType: 'hotels', placeData: {} }
  onePlaceInfo = { placeType: '', placeData: {} }
  moreHotelsInfo = { placeType: 'hotels', placeData: {} }

  constructor(cityName) {
    this.cityName = cityName
  }

  async findCity() {
    const params = { query: this.cityName, key: process.env.API_KEY }
    try {
      const response = await axios(this.rootURL, { params, timeout: 1000 * 60 })
      this.cityInfo.placeData = response.data
    } catch (error) {
      debug(`maps-api find-city error: ${error}`)
    }
  }

  async findPlaces() {
    //Promise function for API call
    let placesDataResults = []

    const fn = ({ placeType }) => {
      const params = { query: this.cityName, key: process.env.API_KEY, type: placeType }
      return axios(this.rootURL, { params, timeout: 1000 * 60 })
    }

    //map forEach place an API call
    var requests = this.placesInfo.map(fn)
    try {
      const results = await Promise.all(requests)
      placesDataResults = results.map((response) => {
        return response.data
      })
      //update this.placesInfo.placeData
      this.placesInfo.forEach((el, index) => {
        el.placeData = placesDataResults[index]
      })
    } catch (error) {
      debug(`maps-api find-places error: ${error}`)
    }
  }

  async findHotels() {
    const params = {
      query: `${this.queryString} in ${this.cityName}`,
      key: process.env.API_KEY
      // TODO pagetoken: this.hotlesInfo.next_page_token
    }
    try {
      const response = await axios(this.rootURL, { params, timeout: 1000 * 60 })
      this.hotelsInfo.placeData = response.data
    } catch (error) {
      debug(`maps-api find-hotels error: ${error}`)
    }
  }

  async findMoreHotels(next_page_token) {
    const params = {
      query: `${this.queryString} in ${this.cityName}`,
      key: process.env.API_KEY,
      pagetoken: next_page_token
    }
    try {
      const response = await axios(this.rootURL, { params, timeout: 1000 * 60 })
      this.moreHotelsInfo.placeData = response.data
    } catch (error) {
      debug(`maps-api find-hotels error: ${error}`)
    }
  }

  async findOnePlace(placeType, next_page_token) {
    const params = {
      query: this.cityName,
      key: process.env.API_KEY,
      type: placeType,
      pagetoken: next_page_token
    }
    try {
      const response = await axios(this.rootURL, { params, timeout: 1000 * 60 })
      this.onePlaceInfo.placeType = placeType
      this.onePlaceInfo.placeData = response.data
    } catch (error) {
      debug(`maps-api find-one-place error: ${error}`)
    }
  }
}

export { Searcher }
