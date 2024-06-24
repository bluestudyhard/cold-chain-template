<!--
 * new page
 * @author: blue
 * @since: 2024-06-18
 * index.vue
-->
<script setup lang="ts">
import { useManageStore } from '@/store/modules/management'
import { useOverViewStore } from '@/store/modules/overView'
import { WarningData } from '@/types'

const store = useManageStore()
const overViewStore = useOverViewStore()

const options = {
  index: true,
  addBtn: false,
  editBtn: false,
  delBtnText: '已解决',
  align: 'center',
  menuAlign: 'center',
  column: [{
    label: '箱子id',
    prop: 'boxId',
  }, {
    label: '疫苗名称',
    prop: 'vaccineName',
  }, {
    label: '温度',
    prop: 'temperature',
  }, {
    label: '时间',
    prop: 'time',
  }, {
    label: '状态',
    prop: 'status',
  }],
}

interface page {
  pageSize: number
  currentPage: number
  total: number
  pagerCount: number
}

const data = ref<(WarningData & {
  boxId: string
})[]>([])

function onLoadPatchesData(page: page) {
  data.value = store.warningDataList
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    )

  page.total = store.warningData.size
}

watch(store.warningData, async () => {
  onLoadPatchesData({
    pageSize: 10,
    pagerCount: 5,
    currentPage: 1,
    total: 0,
  })
}, { immediate: true })

onMounted(async () => {
  await overViewStore.init()
  overViewStore.subcribeBoxMessage()
})
</script>

<template>
  <div class="container">
    <avue-crud
      :option="options"
      :data="data"
      @on-load="onLoadPatchesData"
      @row-del="($e:any) => store.rmWarningData($e.boxId)"
    />
  </div>
</template>
