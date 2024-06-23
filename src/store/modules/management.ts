import { defineStore } from 'pinia'
import { fetchInitData } from '@/api/amap'
import {
  InitOverViewData,
  VaccineData,
} from '@/types'

export const useManageStore = defineStore(
  'chain-cold-management',
  () => {
    const initData = shallowRef<InitOverViewData>({
      vaccines: [],
      boxes: [],
    })
    const vaccines = ref<VaccineData[]>([])
    const cityData = new Map<string, number>()

    /**
     * @description: 获取设备管理的初始化数据
     */
    async function getInitData() {
      const res = await fetchInitData()
      console.log('init-data', res)
      initData.value = res
    }

    return {
      initData,
      getInitData,
    }
  },

  {
    persist: true,
  },
)
