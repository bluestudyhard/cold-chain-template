import { defineStore } from 'pinia'
import {
  fetchBoxMessages,
  fetchInitData,
  getLocationData,
} from '@/api/amap'
import {
  BoxMessages,
  InitMapsData,
  InitOverViewData,
  VaccineData,
} from '@/types'

export const useOverViewStore = defineStore('chain-cold-overView', () => {
  const initData = shallowRef<InitOverViewData>({
    vaccines: [],
    boxes: [],
  })

  const overViewMapsData = ref<InitMapsData[]>([])
  const departureCitys = ref<string[]>([])
  const arrivalCitys = ref<string[]>([])

  const vaccines = ref<VaccineData[]>([])
  const boxMessages = ref<BoxMessages[]>([])

  async function _getPatchNames(location: string) {
    try {
      const locationInfo = await getLocationData(location)
      if (locationInfo.status === '1') {
        return locationInfo.regeocode.formatted_address
      }
    }
    catch (error) {
      console.log('error', error)
    }
  }

  async function _getLocationData(location: string) {
    try {
      console.log('getLocationData', location)
      const locationInfo = await getLocationData(location)

      return locationInfo.regeocode
    }
    catch (error) {
      console.error('error', error)
      return null
    }
  }

  async function getInitData() {
    const res = await fetchInitData()
    console.log('init-data', res)
    initData.value = res
  }

  /**
   * @description: 获取所有的盒子数据
   */
  async function getBoxMessageData() {
    boxMessages.value = await fetchBoxMessages()
  }

  /**
   * @description: 初始化echarts地图数据
   */
  async function initMapsData() {
    console.log('boxMessages', toRaw(boxMessages.value))
    overViewMapsData.value = []

    for (const item of boxMessages.value) {
      const data = await _getLocationData(`${item.longitude},${item.latitude}`)

      if (!data)
        continue

      const provinceName = data.addressComponent.province || '未知'
      const addressName = data.formatted_address || '未知'

      const mapData: InitMapsData = {
        provinceName: provinceName.replace(/省|市|自治区/g, ''),
        value: 1,
        boxId: item.boxId,
        coord: {
          boxName: addressName,
          value: [item.longitude, item.latitude],
        },
        battery: item.battery,
        temperature: item.temperature,
      }

      overViewMapsData.value.push(mapData)
    }

    console.log('overViewMapsData', toRaw(overViewMapsData.value))
  }

  async function init() {
    await Promise.all([getInitData(), getBoxMessageData()])

    arrivalCitys.value = initData.value.boxes.map(item => item.arrivalCity)
    vaccines.value = initData.value.vaccines

    await initMapsData()
  }

  return {
    init,
    overViewMapsData,
    vaccines,
  }
}, {
  persist: true,
})
