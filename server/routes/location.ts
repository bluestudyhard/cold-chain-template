import http from 'axios'

async function getLocationName(location: string) {
  const restApi = 'https://restapi.amap.com/v3/geocode/regeo'
  const { mapKey } = useAppConfig()

  const restParams = {
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

export default defineEventHandler(async (event) => {
  const { location } = getQuery(event) as {
    location: string
  }

  const locationData = await getLocationName(location)

  return locationData
})
