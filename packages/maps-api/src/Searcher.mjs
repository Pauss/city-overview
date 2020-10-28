//class Searcher
//[types] : [resturants, museum, hospitals ...]
//method : if city not in DB then make query for API search, otherwise take data from DB.
//method: find data - api call for all place-types
//method : select from find (check places are placed in the 'input City')
//method : add to DB

import axios from 'axios'

class Searcher {
  queryPlace = [
    'restaurant'
    // 'hospital',
    // 'airport',
    // 'bank',
    // 'fire_station',
    // 'museum',
    // 'movie_theater',
    // 'park',
    // 'secondary_school',
    // 'univeristy',
    // 'shopping_mall',
    // 'supermarket',
    // 'tourist_attraction',
    // 'zoo'
  ]
  queryString = 'hotels'
  city = ''
  rootURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

  constructor(city) {
    this.city = city
  }

  async findCity() {
    const params = { query: this.city, key: process.env.API_KEY }
    try {
      const response = await axios(this.rootURL, { params, timeout: 1000 * 60 })
      return response.data
    } catch (error) {
      console.log(`maps-api find-city error: ${error}`)
    }
  }

  async findPlace() {
    let api_results = []

    //Promise function for API call
    const fn = (place) => {
      const params = { query: this.city, key: process.env.API_KEY, type: place }
      return axios(this.rootURL, { params, timeout: 1000 * 60 })
    }

    //map forEach place an API call
    var requests = this.queryPlace.map(fn)
    try {
      const results = await Promise.all(requests)
      api_results = results.map((r) => r.data)
      return api_results
    } catch (error) {
      console.log(`maps-api find-place error: ${error}`)
    }
  }

  async findHotles() {
    const params = { query: `${this.queryString} in ${this.city}`, key: process.env.API_KEY }
    try {
      const response = await axios(this.rootURL, { params, timeout: 1000 * 60 })
      return response.data
    } catch (error) {
      console.log(`maps-api find-hotels error: ${error}`)
    }
  }
}

export { Searcher }
