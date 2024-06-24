import { defineStore } from 'pinia'
import { useOverViewStore } from './overView'
import { fetchInitData } from '@/api/amap'
import {
  OverViewData,
  VaccineData,
} from '@/types'

export const useManageStore = defineStore('chain-cold-management', () => {
  const overView = useOverViewStore()

  return {
  }
}, {
  // persist: true,
})
