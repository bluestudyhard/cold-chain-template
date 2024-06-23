import type { BoxPatchData } from './box'
import type { VaccineData } from './vaccines'

export * from './amap'
export * from './box'
export * from './vaccines'

export interface OverViewData {
  vaccines: VaccineData[]
  boxes: BoxPatchData[]
}

export interface MapsData {
  provinceName: string
  value: number
  boxId: string
  coord: {
    boxName: string
    value: [string, string]
  }
  battery: string
  temperature: string
  statusColor: string
  vaccineStatus: string
  temperRange: string
}
