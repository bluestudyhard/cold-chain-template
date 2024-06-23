import { fetchEventSource } from '@microsoft/fetch-event-source'

import { http } from '@/utils/http'
import type {
  AMapRegeoResponse,
  BoxMessages,
  OverViewData,
} from '@/types/index'

export const baseUrl = 'http://localhost:3090'

export type LocationResult = AMapRegeoResponse

const unkownLocation = {
  addressComponent: { province: '未知' },
  formatted_address: '未知',
}

const locationCache = new Map<string, typeof unkownLocation>()

export async function getLocationData(location: string) {
  if (locationCache.has(location)) {
    return locationCache.get(location)
  }

  try {
    const res = await http.get<LocationResult>(`${baseUrl}/location`, {
      params: { location },
    })

    if (!res.regeocode?.formatted_address) {
      return unkownLocation
    }

    locationCache.set(location, res.regeocode)

    return res.regeocode
  }
  catch (e) {
    console.error('getLocationData', e)
    return unkownLocation
  }
}

export async function fetchInitData() {
  const res = await http.get<OverViewData>(`${baseUrl}/info`)
  return res
}

export async function fetchBoxMessages() {
  const res = await http.get<BoxMessages[]>(`${baseUrl}/boxMessage`)
  return res
}

export async function pollingFetch() {
  await fetchEventSource(`${baseUrl}/polling`, {
    onmessage(ev) {
      const data = JSON.parse(ev.data) as BoxMessages[]

      console.log(data[0])
    },
  })
}
