import axios from 'axios'
import {} from 'dotenv/config.js'

async function getCityRestaurants() {
  const params = { query: 'spitale in Falticeni', key: process.env.API_KEY }
  const rootURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

  try {
    const response = await axios(rootURL, { params, timeout: 1000 * 60 })
    return response.data
  } catch (error) {
    console.log(`maps-api error: ${error}`)
  }
}

async function displayRestaurants() {
  try {
    const data = await getCityRestaurants()

    console.log(data.results)

    console.log(`Number of results: ${data.results.length}`)

    data.results.forEach((element) => {
      console.log(`Name: ${element.name}`)
      console.log(`Adress: ${element.formatted_address}`)
      console.log(`Business_status: ${element.business_status}`)
      console.log(`Rationg: ${element.rating}`)
      console.log(`Number of ratings: ${element.user_ratings_total}`)

      console.log('\n#################################')
    })
  } catch (err) {
    console.log(`Error: ${err}`)
  }
}

export { displayRestaurants }
