<script setup lang="ts">
import { useOverViewStore } from '@/store/modules/overView'

const store = useOverViewStore()
</script>

<template>
  <div
    class="font-bold flex justify-between items-center p-4 bg-white shadow-md rounded-lg absolute top-0 left-0"
  >
    <h3>疫苗温度总览</h3>

    <div class="ml-10 flex-c gap-2">
      <span
        class="text-green-500"
      >{{ store.statusCount.normal }}
      </span>
      /
      <span
        class="text-red-500"
      >
        {{ store.statusCount.abnormal }}
      </span>
      /

      <span class="text-blue-500">
        {{ store.statusCount.total }}
      </span>
    </div>
  </div>
</template>

<style scoped>
span {
  font-size: 1.2rem;
}
</style>
