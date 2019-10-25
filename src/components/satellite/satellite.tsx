import { Component, h, Host, Prop } from '@stencil/core'
import axios from 'axios'
import { threeService } from '../../services/three-service'

const api = axios.create({
    baseURL: 'https://www.n2yo.com/rest/v1/satellite',
})

const SECONDS_OF_FUTURE_POSITIONS = 300 // maximum of 300, gives an array of where satellite will be at that second

// Greenbelt, MD observer location
const OBSERVER_LATITUDE = 39.0003
const OBSERVER_LONGITUDE = -76.8863
const OBSERVER_ALTITUDE = 0 // TODO: figure out how to use actual altitude (157') with API

@Component({
    tag: 'gd-satellite',
    shadow: false,
})
export class Satellite {
    @Prop() noradId: number
    @Prop() name: string

    componentDidLoad() {
        if (!this.noradId) throw new Error('Need to provide a Norad ID!')

        this.findSatellite()
    }

    async findSatellite() {
        // TODO: move this to a backend API so we can make use of caching and the api key isn't exposed
        let response = await api.get(
            `/positions/${this.noradId}/${OBSERVER_LATITUDE}/${OBSERVER_LONGITUDE}/${OBSERVER_ALTITUDE}/${SECONDS_OF_FUTURE_POSITIONS}&apiKey=${process.env.TRACKER_API_KEY}`
        )
        console.log('emitting ', response.data)

        let positions = response.data.positions

        threeService.addSatellite(
            positions[0].satlatitude,
            positions[0].satlongitude
        )
    }

    render() {
        return <Host />
    }
}
