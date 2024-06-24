<!--
 * new page
 * @author: blue
 * @since: 2024-06-18
 * index.vue
-->
<script setup lang="ts">
import { useOverViewStore } from '@/store/modules/overView'

const overView = useOverViewStore()
const vaccines = ref<{
  id: string
  name: string
  threshold: string
  count: number
}[]>([])

const options = {
  index: true,
  align: 'center',
  menuAlign: 'center',
  column: [{
    label: '疫苗ID',
    prop: 'id',
  }, {
    label: '疫苗名称',
    prop: 'name',
  }, {
    label: '适宜温度阈值',
    prop: 'threshold',
  }, {
    label: '装车数量',
    prop: 'count',
  }],
}

interface page {
  pageSize: number
  currentPage: number
  total: number
  pagerCount: number
}

function onLoadPatchesData(page: page) {
  vaccines.value = overView.vaccines
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    )
    .map(data => ({
      ...data,
      threshold: `${data.low}°C ~ ${data.high}°C`,
      count: overView.initData.boxes.filter(
        box => box.vaccineId === data.id,
      ).length,
    }))
  page.total = overView.vaccines.length
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
      :data="vaccines"
      @on-load="onLoadPatchesData"
    />
  </div>
</template>
