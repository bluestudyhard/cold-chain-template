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

  const cityData = new Map<string, number>()

  async function _getLocationData(location: string) {
    const locationInfo = await getLocationData(location)

    if (!locationInfo?.formatted_address) {
      return {
        addressComponent: { province: '未知' },
        formatted_address: '未知',
      }
    }

    return locationInfo
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
    const data = await fetchBoxMessages()

    console.log('boxMessages', data)

    for (const item of data) {
      const mapData = await getMapData(item)
      const { provinceName } = mapData

      overViewMapsData.value.push(mapData)

      const count = cityData.get(provinceName) || 0
      cityData.set(mapData.provinceName, count + 1)
    }

    console.log(cityData)
  }

  async function getMapData(item: BoxMessages) {
    const data = await _getLocationData(`${item.longitude},${item.latitude}`)

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
    return mapData
  }

  async function init() {
    await Promise.all([getInitData(), getBoxMessageData()])

    arrivalCitys.value = initData.value.boxes.map(item => item.arrivalCity)
    vaccines.value = initData.value.vaccines
  }

  return {
    init,
    cityData,
    overViewMapsData,
    vaccines,
  }
}, {
  // persist: true,
})
