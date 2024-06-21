import { http } from "@/utils/http"
const restApi = "https://restapi.amap.com/v3/geocode/regeo"
const restParams = {
    output: "json",
    location: "",
    key: import.meta.env.VITE_LOCATION_KEY,
    radius: "0",
    extensions: "all"
}
console.log(restParams.key)
export const getLocationName = async (location: string) => {
    restParams.location = location
    // 打印实际请求的url
    console.log(`${restApi}?${new URLSearchParams(restParams).toString()}`)
    const data: any = await http.get(restApi, { params: restParams })
    console.log("apmap信息", data)
    return data.regeocode.formatted_address
}
