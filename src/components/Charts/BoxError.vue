<!--
 * new page
 * @author: blue
 * @since: 2024-06-25
 * BoxError.vue
-->
<script setup lang="ts">
import { useOverViewStore } from '@/store/modules/overView'
import type { MapsData } from '@/types/index'

const store = useOverViewStore()
const boxMessage = ref<MapsData[]>([])
const config = ref({
  header: ['ID', '位置', '温度', '状态'],
  data: [
  ],

  align: ['center'],

})
onMounted(async () => {
  await store.init()
})
watchEffect(() => {
  if (store.statusCount.abnormal) {
    boxMessage.value = store.overViewMapsData.filter(item => item.vaccineStatus !== '正常')
    config.value.data = boxMessage.value.map((item) => {
      return [item.boxId, item.coord.boxName, item.temperature, item.vaccineStatus]
    })
  }
})
</script>

<template>
  <div class="container">
    <dv-scroll-board
      class="absolute top-0 "
      :config="config"
      style="right: 3%;width:25%;height:220px;"
    />
  </div>
</template>
