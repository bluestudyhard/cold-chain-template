import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
import { useOverViewStore } from './overView'
import {
  WarningData,
} from '@/types'

export const useManageStore = defineStore('chain-cold-management', () => {
  const overView = useOverViewStore()

  /**
   * 预警信息
   */
  const warningData = ref(new Map<string, WarningData>())
  const warningDataList = ref<(WarningData & {
    boxId: string
  })[]>([])

  watchEffect(() => {
    for (const data of overView.overViewMapsData) {
      if (data.vaccineStatus !== '正常') {
        warningData.value.set(data.boxId, {
          time: data.createdAt,
          vaccineName: data.vaccineName,
          temperature: data.temperature,
          status: data.vaccineStatus,
        })
      }
    }

    warningDataList.value = Array.from(warningData.value).map(([boxId, data]) => ({
      ...data,
      boxId,
    }))
  })

  function rmWarningData(boxId: string) {
    console.log('rmWarningData', boxId)
    warningData.value.delete(boxId)
  }

  return {
    warningData,
    warningDataList,
    rmWarningData,
  }
}, {
  // persist: true,
})
