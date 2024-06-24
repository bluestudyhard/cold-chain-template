import { defineStore } from 'pinia'
import PQueue from 'p-queue'
import {
  fetchBoxMessages,
  fetchInitData,
  getLocationData,
  pollingBoxMessages,
} from '@/api/amap'
import {
  BoxMessages,
  MapsData,
  OverViewData,
  VaccineData,
} from '@/types'

export const useOverViewStore = defineStore('chain-cold-overView', () => {
  const initData = shallowRef<OverViewData>({
    vaccines: [],
    boxes: [],
  })

  const overViewMapsData = ref<MapsData[]>([])

  const vaccines = ref<VaccineData[]>([])
  const cityData = new Map<string, number>()

  async function getInitData() {
    const res = await fetchInitData()
    console.log('init-data', res)
    initData.value = res
  }

  async function setBoxMessageData(data: BoxMessages[]) {
    const tmpMap: MapsData[] = []
    cityData.clear()

    // 限制并发数
    const queue = new PQueue({ concurrency: 10 })
    for (const item of data) {
      queue.add(async () => {
        const mapData = await getMapData(item)
        tmpMap.push(mapData)

        const { provinceName } = mapData
        const count = cityData.get(provinceName) || 0
        cityData.set(provinceName, count + 1)
      })
    }
    await queue.onIdle()

    overViewMapsData.value = tmpMap

    console.log({ cityData })
  }

  async function getMapData(item: BoxMessages) {
    const data = await getLocationData(`${item.longitude},${item.latitude}`)

    const provinceName = data.addressComponent.province
    const addressName = data.formatted_address

    const { vaccineId } = initData.value.boxes.find(b => b.id === item.boxId)
    const vaccine = initData.value.vaccines.find(v => v.id === vaccineId)
    const vaccineStatus = getStatus(item.temperature, vaccine.low, vaccine.high)

    const mapData: MapsData = {
      provinceName: provinceName.replace(/省|市|自治区/g, ''),
      value: 1,
      boxId: item.boxId,
      coord: {
        boxName: addressName,
        value: [item.longitude, item.latitude],
      },
      battery: item.battery,
      temperature: item.temperature,
      statusColor: vaccineStatus === '正常' ? '#22c55e' : '#dc2626',
      vaccineStatus,
      temperRange: `${vaccine.low}℃ ~ ${vaccine.high}℃`,
    }
    return mapData
  }

  function getStatus(temperature: string, low: string, high: string) {
    const _temperature = Number.parseFloat(temperature)
    const _low = Number.parseFloat(low)
    const _high = Number.parseFloat(high)

    if (_temperature < _low)
      return '温度过低'
    else if (_temperature > _high)
      return '温度过高'
    return '正常'
  }

  async function init() {
    if (initData.value.vaccines.length > 0)
      return

    await getInitData()
    vaccines.value = initData.value.vaccines

    // const boxMessages = await fetchBoxMessages()
    // await setBoxMessageData(boxMessages)
  }

  /**
   * 订阅箱子消息，实时更新地图数据
   */
  function subcribeBoxMessage() {
    pollingBoxMessages(async data => setBoxMessageData(data))
  }

  return {
    init,
    subcribeBoxMessage,
    cityData,
    overViewMapsData,
    vaccines,
    initData,
  }
}, {
  // persist: true,
})
