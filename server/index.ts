import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express from 'express'
import http from 'axios'
import cors from 'cors'
import 'dotenv/config'
import type { AMapRgeoOptions } from '../src/types/amap'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

const app = express()
const restApi = 'https://restapi.amap.com/v3/geocode/regeo'

const {
  VITE_LOCATION_KEY: mapKey,
} = process.env

console.log({ mapKey })

if (!mapKey) {
  console.error('未提供高德地图key')
  process.exit(1)
}

async function getLocationName(location: string) {
  const restParams: AMapRgeoOptions = {
    output: 'JSON',
    location,
    key: mapKey!,
    radius: 1000,
    extensions: 'base',
    roadlevel: 1,
  }

  // 打印实际请求的url
  // console.log(
  //   '请求url'
  //   + `${restApi}?${new URLSearchParams(restParams as Record<string, any>).toString()}`,
  // )

  const res = await http.get(restApi, {
    params: restParams,
  })

  return res.data
}

const port = 3090
app.use(cors())

app.use(express.static(path.join(root, 'mock')))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/location', async (req, res) => {
  const location = req.query.location as string
  const locationData = await getLocationName(location)
  res.send(locationData)
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
