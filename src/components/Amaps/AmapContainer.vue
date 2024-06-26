<script setup lang="ts">
import {
  computed,
  defineProps,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
  withDefaults,
} from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useDark } from '@pureadmin/utils'
import generateRandomColor from '@/utils/generateRandomColor'
import movingCarIcon from '@/assets/moving-car.png'

/**
 * path: [starPosition, endPosition]
 * carPosition: carPositon
 */

interface Path {
  path: [number, number][]
  carPosition: [number, number]
}
const props = withDefaults(defineProps<Path>(), {
  path: () => [
    [116.5, 40],
    [113.2, 24.1],
  ],
})

const AmapKey = import.meta.env.VITE_AMAP_KEY
const { isDark } = useDark()
const map = ref(null)
let car: any = null
const MAP_ZOOM = 4.3
const CAR_ZOOM = 7
// mock数据车的运动
const CAR_SPEED = 0.0005
let moveInterval: any = null
const currentCarPosition = ref<any>(props.carPosition || props.path[0])
const path = ref<any>(props.path)
const followCarCenter = ref(false)
const isZoomMapToCar = computed({
  get() {
    if (!map.value)
      return false
    return map.value.getZoom() > MAP_ZOOM
  },
  set: (value) => {
    if (value) {
      map.value.setZoom(CAR_ZOOM)
      followCarCenter.value = true
    }
    else {
      map.value.setZoom(MAP_ZOOM)
      followCarCenter.value = false
    }
  },
})

const initialPosition = [116.397428, 39.90923]
const initialPath = props.path

function resetMap() {
  map.value.setZoomAndCenter(MAP_ZOOM, initialPosition)
  followCarCenter.value = false
}

function generatePosition(
  coord1: [number, number],
  coord2: [number, number],
  factor: number,
) {
  const [lon1, lat1] = coord1
  const [lon2, lat2] = coord2
  const randomLon = lon1 + (lon2 - lon1) * factor
  const randomLat = lat1 + (lat2 - lat1) * factor
  return [randomLon, randomLat]
}

function initMap(AMap: any) {
  map.value = new AMap.Map('container', {
    mapStyle: 'amap://styles/normal',
    zoom: MAP_ZOOM,
    center: initialPosition,
    scrollWheel: false,
    doubleClickZoom: false,
    dragEnable: false,
    keyboardEnable: false,
  })

  const startMarker = addMapMarker(AMap, path.value[0], true)
  const endMarker = addMapMarker(AMap, path.value[path.value.length - 1], false)

  const polyline = new AMap.Polyline({
    path: [path.value],
    strokeColor: generateRandomColor(),
    strokeWeight: 4,
  })
  map.value.add(polyline)

  const viaIcon = new AMap.Icon({
    size: new AMap.Size(40, 40),
    image: movingCarIcon,
  })

  car = new AMap.Marker({
    map: map.value,
    position: currentCarPosition.value,
    icon: viaIcon,
    offset: new AMap.Pixel(-15, -30),
  })

  car.on('click', handleCarClick)

  let moveFactor = 0
  moveInterval = setInterval(() => {
    moveFactor += CAR_SPEED
    if (moveFactor > 1)
      moveFactor = 0
    const newPosition = generatePosition(path.value[0], path.value[1], moveFactor)
    car.setPosition(newPosition)
    if (followCarCenter.value)
      map.value.setCenter(newPosition)
    // console.log('getPosition', car.getPosition())
    handleCarMove({ lnglat: { lng: newPosition[0], lat: newPosition[1] } })
  }, 100)

  watch(
    () => isDark.value,
    () => {
      console.log('watch', isDark.value)
      isDark.value
        ? map.value?.setMapStyle('amap://styles/darkblue')
        : map.value.setMapStyle('amap://styles/normal')
    },
    { immediate: true, deep: true },
  )

  const title = '方恒假日酒店<span style="font-size:11px;color:#F00;">价格:318</span>'
  const content = [
    '<img src=\'http://tpc.googlesyndication.com/simgad/5843493769827749134\'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里',
    '电话：010-64733333',
    '<a href=\'https://ditu.amap.com/detail/B000A8URXB?citycode=110105\'>详细信息</a>',
  ]

  function handleCarClick(event: any) {
    map.value.setZoom(7)
  }

  function handleCarMove(event: any) {

  }
}

function addMapMarker(AMap: any, position: [number, number], isStart: boolean) {
  const icon = isStart
    ? new AMap.Icon({
      size: new AMap.Size(40, 40),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
      imageSize: new AMap.Size(135, 40),
    })
    : new AMap.Icon({
      size: new AMap.Size(25, 34),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
      imageSize: new AMap.Size(135, 40),
      imageOffset: new AMap.Pixel(-95, -3),
    })
  return new AMap.Marker({
    map: map.value,
    position,
    icon,
    offset: new AMap.Pixel(-15, -30),
  })
}

onMounted(() => {
  AMapLoader.load({
    key: AmapKey,
    version: '2.0',
    plugins: [],
  })
    .then((AMap) => {
      initMap(AMap)
    })
    .catch((e) => {
      console.log(e)
    })
})

onBeforeMount(() => {
  // Data fetching logic can be added here
})

onUnmounted(() => {
  clearInterval(moveInterval)
  map.value?.destroy()
})
</script>

<template>
  <div>
    <div class="wrapper">
      <ElButton type="success" @click="resetMap">
        重置地图配置
      </ElButton>
      <span> | </span>
      <span>是否跟随货车移动：</span><ElSwitch v-model="followCarCenter" />
      <span> | </span>
      <span>是否放大地图：</span><ElSwitch v-model="isZoomMapToCar" />
    </div>
    <div id="root">
      <div id="container" />
    </div>
  </div>
</template>

<style scoped lang="scss">
#container {
  width: 100%;
  height: 90vh;
}

.wrapper {
  position: relative;
  z-index: 999;
}

.amap-icon {
  user-select: none;
}
</style>
