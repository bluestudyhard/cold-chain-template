<!--
 * new page
 * @author: blue
 * @since: 2024-06-18
 * index.vue
-->
<script setup lang="ts">
import { useManageStore } from '@/store/modules/management'
import {
  BoxPatchInitData,
  InitOverViewData,
} from '@/types'

const deviceOverViewData = ref<InitOverViewData>()
const patchOverViewData = ref<BoxPatchInitData[]>([])
const store = useManageStore()

/**
 * table options
 */

const currentPage = ref(1)

const options = {
  index: true,
  align: 'center',
  menuAlign: 'center',
  column: [{
    label: '批次ID',
    prop: 'patchId',
  }, {
    label: '疫苗ID',
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
    label: '预计到达时间',
    prop: 'arrivalTime',
  }],
}

const pagination = ref({
  pageSize: 5,
  pagerCount: 5,
  currentPage: 1,
  total: 0,
})

/**
 * @description 分页
 */
interface page {
  pageSize: number
  currentPage: number
  total: number
  pagerCount: number
}
async function init() {
  await store.getInitData()
}
Promise.all([init()])
function onLoadPatchesData(page: page) {
  console.log(page)
  deviceOverViewData.value = store.initData
  patchOverViewData.value = deviceOverViewData.value.boxes.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  )

  page.total = patchOverViewData.value.length
}

function rowSave(row, done, loading) {
  done(row)
}
function rowDel(row, index, done) {
  done(row)
}
function rowUpdate(row, index, done, loading) {
  done(row)
}
</script>

<template>
  <div class="container">
    <h1>设备管理</h1>
    {{ patchOverViewData }}
    <avue-crud

      :option="options"
      :data="patchOverViewData"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @on-load="onLoadPatchesData"
    />
  </div>
</template>
