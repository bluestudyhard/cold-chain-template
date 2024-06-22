import type { BoxPatchInitData } from './box'
import type { VaccineData } from './vaccines'

export * from './amap'
export * from './box'
export * from './vaccines'

export interface InitOverViewData {
  vaccines: VaccineData[]
  boxes: BoxPatchInitData[]
}

export interface InitMapsData {
  provinceName: string
  value: number
  boxId: string
  coord: {
    boxName: string
    value: [string, string]
  }
  battery: string
  temperature: string
}
