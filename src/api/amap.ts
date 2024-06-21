import { http } from "@/utils/http"
import type {
    AMapRegeoResponse,
    BoxMessageData,
    initOverViewData
} from "@/types/index"
const baseUrl = "http://localhost:3090"
const locationUrl = "/location"

export type LocationResult = AMapRegeoResponse

export const getPatchLocationData = async (location: string) => {
    // 打印实际请求的 URL
    console.log(baseUrl + locationUrl)
    console.log("real 坐标", location)
    const res = await http.request<LocationResult>(
        "get",
        baseUrl + locationUrl,
        {
            params: { location }
        }
    )
    return res
}

export const getInitPatchLocationData = async () => {
    const res = await http.request<initOverViewData>(
        "get",
        "/mock/init-data.json"
    )
    return res
}
export const getInitMapsData = async () => {
    const res = await http.request<BoxMessageData[]>(
        "get",
        "/mock/boxMessages.json"
    )
    return res
}
