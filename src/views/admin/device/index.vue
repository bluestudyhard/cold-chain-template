<!--
 * new page
 * @author: blue
 * @since: 2024-06-18
 * index.vue
-->
<script setup lang="ts">
import { pollingFetch } from '@/api/amap'

onMounted(async () => {
  pollingFetch()
})
</script>

<template>
  <div class="container">
    <h1>设备管理</h1>
  </div>
</template>
