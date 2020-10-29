import {} from 'dotenv/config.js'
import { Searcher } from './Searcher.mjs'

class PreparedSearcher extends Searcher {
  city = [{}]
  places = [{}]
  hotels = [{}]
  fakeCity = [{}]
  cityComplete = {}

  fakeApiCall() {
    this.fakeCity = [
      {
        business_status: 'OPERATIONAL',
        formatted_address: 'Strada Luceafărului 22, Suceava, Romania',
        geometry: {
          location: {
            lat: 47.638955,
            lng: 26.2394067
          },
          viewport: {
            northeast: {
              lat: 47.64034752989272,
              lng: 26.24064742989272
            },
            southwest: {
              lat: 47.63764787010728,
              lng: 26.23794777010728
            }
          }
        }
      },
      {
        business_status: 'OPERATIONAL',
        formatted_address: 'Strada Luceafărului 22, Iasi, Romania',
        geometry: {
          location: {
            lat: 47.638955,
            lng: 26.2394067
          },
          viewport: {
            northeast: {
              lat: 47.64034752989272,
              lng: 26.24064742989272
            },
            southwest: {
              lat: 47.63764787010728,
              lng: 26.23794777010728
            }
          }
        }
      }
    ]
  }

  async makeAPICall() {
    //await this.findCity()
    //await this.findPlaces()
    //await this.findHotels()
  }

  async verifyAPIResult() {
    const regex = new RegExp(this.cityName, 'g')
    //this.cityInfo.results.filter
    this.fakeApiCall()
    let result = this.fakeCity.filter((place) => {
      if (place.formatted_address.match(regex) != null) return place
    })
    this.city = result

    //result = this.cityInfo.results.filter((place) => place.formatted_address.match(regex) !== null)
    result = this.fake
  }
}

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
//function verifyCompletness

//verify Data is correct (all places/ hotels are inside the city from input)
//function verifyCorectness

export { PreparedSearcher }
