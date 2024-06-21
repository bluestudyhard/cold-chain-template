export * from "./amap"
export * from "./box"
export * from "./vaccines"
import type { BoxPatchInitData } from "./box"
import type { VaccineData } from "./vaccines"

export interface initOverViewData {
    vaccines: VaccineData[]
    boxes: BoxPatchInitData[]
}
export interface initMapsData {
    provinceName: string
    value: number
    coord: {
        boxName: string
        value: [string, string]
    }
    battery: string
    temperature: string
}
