import { http } from '@/utils/http'
import type {
  AMapRegeoResponse,
  BoxMessages,
  InitOverViewData,
} from '@/types/index'

const baseUrl = 'http://localhost:3090'

export type LocationResult = AMapRegeoResponse

export async function getLocationData(location: string) {
  // 打印实际请求的 URL
  // console.log(baseUrl + locationUrl)
  // console.log('real 坐标', location)

  try {
    const res = await http.get<LocationResult>(`${baseUrl}/location`, {
      params: { location },
    })
    return res.regeocode
  }
  catch (e) {
    console.error('getLocationData', e)
    return null
  }
}

export async function fetchInitData() {
  const res = await http.get<InitOverViewData>(`${baseUrl}/init-data.json`)
  return res
}

export async function fetchBoxMessages() {
  const res = await http.get<BoxMessages[]>(`${baseUrl}/boxMessages.json`)
  return res
}
