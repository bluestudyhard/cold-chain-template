<!--
 * new page
 * @author: blue
 * @since: 2024-06-18
 * index.vue
-->
<script setup lang="ts">
import { useManageStore } from '@/store/modules/management'
import { useOverViewStore } from '@/store/modules/overView'
import {
  BoxPatchData,
} from '@/types'

const BoxesData = ref<BoxPatchData[]>([])

const overView = useOverViewStore()
const store = useManageStore()

const currentPage = ref(1)

const options = {
  index: true,
  align: 'center',
  menuAlign: 'center',
  column: [{
    label: '批次ID',
    prop: 'patchId',
  }, {
    label: '疫苗名称',
    prop: 'vaccineId',
  }, {
    label: '出发时间',
    prop: 'departureTime',
  }, {
    label: '出发城市',
    prop: 'departureCity',
  }, {
    label: '到达城市',
    prop: 'arrivalCity',
  }, {
    label: '到达时间',
    prop: 'arrivalTime',
  }],
}

interface page {
  pageSize: number
  currentPage: number
  total: number
  pagerCount: number
}

function onLoadPatchesData(page: page) {
  BoxesData.value = overView.initData.boxes
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    )
    .map(data => ({
      ...data,
      arrivalTime: data.arrivalTime || '仍在途中',
      vaccineId: overView.vaccines.find(v => v.id === data.vaccineId).name,
    }))
  page.total = overView.initData.boxes.length
}

onMounted(async () => {
  await overView.init()

  onLoadPatchesData({
    pageSize: 10,
    pagerCount: 5,
    currentPage: 1,
    total: 0,
  })
})
</script>

<template>
  <div class="container">
    <avue-crud
      :option="options"
      :data="BoxesData"
      @on-load="onLoadPatchesData"
    />
  </div>
</template>
