import { defineStore } from 'pinia'
import {
  getInitMapsData,
  getInitPatchLocationData,
  getPatchLocationData,
} from '@/api/amap'
import type {
  BoxMessageData,
  InitMapsData,
  InitOverViewData,
  VaccineData,
} from '@/types'

export const useOverViewStore = defineStore('chain-cold-overView', () => {
  const overViewTotalData = shallowRef<InitOverViewData>({
    vaccines: [],
    boxes: [],
  })
  const overViewMapsData = shallowRef<InitMapsData[]>([])
  const departureCitys = ref<string[]>([])
  const boxMessageData = ref<BoxMessageData[]>([])
  const arrivalCitys = ref<string[]>([])
  const vaccines = ref<VaccineData[]>([])

  function getOverViewTotalData() {
    return overViewTotalData.value
  }
  function getDepartureCitys() {
    return departureCitys.value
  }
  function getArrivalCitys() {
    return arrivalCitys.value
  }
  /**
   * @description: 获取所有的疫苗数据
   */
  function getVaccines() {
    return vaccines.value
  }
  /**
   * @description: 获取初始化地图数据
   */
  function getOverViewMapsData() {
    return overViewMapsData.value
  }

  async function _getPatchNames(location: string) {
    try {
      const locationInfo = await getPatchLocationData(location)
      if (locationInfo.status === '1') {
        return locationInfo.regeocode.formatted_address
      }
    }
    catch (error) {
      console.log('error', error)
    }
  }
  async function _getPatchLocationData(location: string) {
    try {
      const locationInfo = await getPatchLocationData(location)

      return locationInfo.regeocode
    }
    catch (error) {
      console.log('error', error)
    }
  }
  async function _getOverViewData() {
    if (Object.keys(overViewTotalData.value).length)
      return
    const res = await getInitPatchLocationData()
    console.log('init-data', res)
    overViewTotalData.value = res
  }
  async function _getDepartCitysData() {
    if (departureCitys.value.length)
      return
    overViewTotalData.value.boxes.forEach((item) => {
      departureCitys.value.push(item.departureCity)
    })
  }
  async function _getArrivalCitysData() {
    if (arrivalCitys.value.length)
      return
    overViewTotalData.value.boxes.forEach((item) => {
      arrivalCitys.value.push(item.arrivalCity)
    })
  }
  async function _getVaccineData() {
    if (vaccines.value.length)
      return
    vaccines.value = overViewTotalData.value.vaccines
  }
  /**
   * @description: 获取所有的盒子数据
   */
  async function _getBoxMessageData() {
    if (boxMessageData.value.length)
      return
    const res = await getInitMapsData()
    boxMessageData.value = res
  }
  /**
   * @description: 初始化echarts地图数据
   */
  async function _getInitMapsData() {
    if (overViewMapsData.value.length)
      return

    const data = await Promise.all(boxMessageData.value.map(async (item) => {
      const data = await _getPatchLocationData(`${item.longitude},${item.latitude}`)
      if (!data)
        return

      const provinceName = data.addressComponent.province || '未知'
      const addressName = data.formatted_address || '未知'
      console.log('data', data)
      console.log(`provinceName: ${provinceName}`)
      // const provinceName =
      //     (await _getPatchLocationData.value(
      //         `${item.longitude},${item.latitude}`
      //     ).addressComponent.province) || "未知"
      // console.log(`provinceName: ${provinceName}`)
      // const addressName =
      //     _getPatchLocationData.value(
      //         `${item.longitude},${item.latitude}`
      //     ).formatted_address || "未知"
      return {
        provinceName,
        value: 1,
        boxId: item.boxId,
        coord: {
          boxName: addressName,
          value: [item.longitude, item.latitude],
        },
        battery: item.battery,
        temperature: item.temperature,
      } as InitMapsData
    }))

    overViewMapsData.value = data.filter(Boolean)
  }
  // 将所有provinceName里面的省份名字去掉省和市或者自治区
  function provinceNameFilter() {
    overViewMapsData.value.forEach((item) => {
      item.provinceName = item.provinceName.replace(
        /省|市|自治区/g,
        '',
      )
    })
  }
  // overViewMapsData.value.forEach(item => {
  //     item.provinceName = item.provinceName.replace(/省|市|自治区/g, "")
  // })

  return {
    _getArrivalCitysData,
    _getBoxMessageData,
    _getDepartCitysData,
    _getInitMapsData,
    _getOverViewData,
    _getVaccineData,
    provinceNameFilter,
    getOverViewMapsData,
    getVaccines,
  }
})
