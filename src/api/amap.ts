import { http } from '@/utils/http'
import type {
  AMapRegeoResponse,
  BoxMessages,
  InitOverViewData,
} from '@/types/index'

const baseUrl = 'http://localhost:3090'
const locationUrl = '/location'

export type LocationResult = AMapRegeoResponse

export async function getLocationData(location: string) {
  // 打印实际请求的 URL
  // console.log(baseUrl + locationUrl)
  // console.log('real 坐标', location)
  const res = await http.request<LocationResult>(
    'get',
    baseUrl + locationUrl,
    {
      params: { location },
    },
  )
  return res
}

export async function fetchInitData() {
  const res = await http.request<InitOverViewData>(
    'get',
    '/mock/init-data.json',
  )
  return res
}

export async function fetchBoxMessages() {
  const res = await http.request<BoxMessages[]>(
    'get',
    '/mock/boxMessages.json',
  )
  return res
}
