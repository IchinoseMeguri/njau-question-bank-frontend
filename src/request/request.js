import axios from 'axios'
import { networkConfig } from './networkConfig.js'

export function requestService(config) {
    const service = axios.create({
        baseURL: networkConfig.serverUrl,
        timeout: networkConfig.requestTimeout
    })
    service.interceptors.request.use(config => {
        return config
    }, error => {
        console.log(error)
        Promise.reject(error)
    })

    service.interceptors.response.use(res => {
        console.log(res)
        return res
    },
        error => {
            return Promise.reject(error)
        }
    )
    return service(config)
}