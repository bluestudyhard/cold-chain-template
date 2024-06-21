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

export const useOverViewStore = defineStore({
  id: 'chain-cold-overView',
  state: () => ({
    overView: {
      icon: 'el-icon-s-data',
    },
    overViewTotalData: {} as InitOverViewData,
    overViewMapsData: [] as InitMapsData[],
    departureCitys: [] as string[],
    boxMessageData: [] as BoxMessageData[],
    arrivalCitys: [] as string[],
    vaccines: [] as VaccineData[],
  }),
  persist: true,
  getters: {
    getOverViewTotalData() {
      return this.overViewTotalData
    },
    getDepartureCitys() {
      return this.departureCitys
    },
    getArrivalCitys() {
      return this.arrivalCitys
    },
    /**
     * @description: 获取所有的疫苗数据
     */
    getVaccines() {
      return this.vaccines
    },
    /**
     * @description: 获取初始化地图数据
     */
    getOverViewMapsData() {
      return this.overViewMapsData
    },
  },
  actions: {
    async _getPatchNames(location: string) {
      try {
        const locationInfo = await getPatchLocationData(location)
        if (locationInfo.status === '1') {
          return locationInfo.regeocode.formatted_address
        }
      }
      catch (error) {
        console.log('error', error)
      }
    },
    async _getPatchLocationData(location: string) {
      try {
        const locationInfo = await getPatchLocationData(location)

        return locationInfo.regeocode
      }
      catch (error) {
        console.log('error', error)
      }
    },
    async _getOverViewData() {
      if (Object.keys(this.overViewTotalData).length)
        return
      const res = await getInitPatchLocationData()
      console.log('init-data', res)
      this.overViewTotalData = res
    },
    async _getDepartCitysData() {
      if (this.departureCitys.length)
        return
      this.overViewTotalData.boxes.forEach((item) => {
        this.departureCitys.push(item.departureCity)
      })
    },
    async _getArrivalCitysData() {
      if (this.arrivalCitys.length)
        return
      this.overViewTotalData.boxes.forEach((item) => {
        this.arrivalCitys.push(item.arrivalCity)
      })
    },
    async _getVaccineData() {
      if (this.vaccines.length)
        return
      this.vaccines = this.overViewTotalData.vaccines
    },
    /**
     * @description: 获取所有的盒子数据
     */
    async _getBoxMessageData() {
      if (this.boxMessageData.length)
        return
      const res = await getInitMapsData()
      this.boxMessageData = res
    },
    /**
     * @description: 初始化echarts地图数据
     */
    async _getInitMapsData() {
      if (this.overViewMapsData.length)
        return
      const temp = await this.boxMessageData.map(async (item) => {
        const data = await this._getPatchLocationData(
                    `${item.longitude},${item.latitude}`,
        )
        if (!data)
          return
        const provinceName = data.addressComponent.province || '未知'
        const addressName = data.formatted_address || '未知'
        console.log('data', data)
        console.log(`provinceName: ${provinceName}`)
        // const provinceName =
        //     (await this._getPatchLocationData(
        //         `${item.longitude},${item.latitude}`
        //     ).addressComponent.province) || "未知"
        // console.log(`provinceName: ${provinceName}`)
        // const addressName =
        //     this._getPatchLocationData(
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
        }
      })
      this.overViewMapsData = await Promise.all(temp)
    },
    // 将所有provinceName里面的省份名字去掉省和市或者自治区
    provinceNameFilter() {
      this.overViewMapsData.forEach((item) => {
        item.provinceName = item.provinceName.replace(
          /省|市|自治区/g,
          '',
        )
      })
    },
    // this.overViewMapsData.forEach(item => {
    //     item.provinceName = item.provinceName.replace(/省|市|自治区/g, "")
    // })
  },
})
