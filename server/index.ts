import express from 'express'
import http from 'axios'
import cors from 'cors'
import type { AxiosResponse } from 'axios'
import type { AMapRegeoResponse, AMapRgeoOptions } from '../src/types/amap'

const app = express()
const restApi = 'https://restapi.amap.com/v3/geocode/regeo'
const restParams: AMapRgeoOptions = {
  output: 'JSON',
  location: '',
  key: 'afe86e03acfd3589fbf14065a98ab56c',
  radius: 0,
  extensions: 'all',
}
console.log('高德地图key', restParams.key)
async function getLocationName(location: string) {
  restParams.location = location
  // 打印实际请求的url
  console.log(
    '请求url'
    + `${restApi}?${new URLSearchParams(restParams as Record<string, any>).toString()}`,
  )
  const res: AxiosResponse<AMapRegeoResponse> = await http.get(restApi, {
    params: restParams,
  })

  return res.data
}

const port = 3090
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/location', async (req, res) => {
  const location = req.query.location as string
  const locationData = await getLocationName(location)
  // 将高德地图返回的数据返回给前端
  res.send(locationData)
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
