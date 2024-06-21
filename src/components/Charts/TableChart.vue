<!--
 * new page
 * @author: blue
 * @since: 2024-06-20
 * TableChart.vue
-->
<template>
    <div class="container">
        <el-button>数据详情</el-button>
        <el-dialog v-model="dialogVisible" width="70%" top="0">
            <template #header>
                <div class="flex justify-between">
                    <span>{{ overViewTitle }}数据概览</span>
                    <el-button>详细信息</el-button>
                </div>
            </template>
            <div ref="chartRef" class="box-chart" />
            <span class="box-overView">
                <el-table :data="dialogInfo" height="200px" border stripe>
                    <el-table-column prop="boxId" label="设备ID" />
                    <el-table-column prop="coord.boxName" label="设备位置" />
                    <el-table-column prop="value" label="设备值" />
                    <el-table-column prop="battery" label="电量" />
                    <el-table-column prop="temperature" label="温度" />
                    <!-- 按钮 -->
                    <el-table-column
                        fixed="right"
                        label="Operations"
                        width="120"
                    >
                        <template #default>
                            <el-button type="primary" size="small"
                                >实时位置</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </span>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useECharts } from "@pureadmin/utils"
import type { BoxMessageData, initMapsData } from "@/types/index"
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef)

const props = defineProps<{
    overViewTitle: string
    dialogInfo: initMapsData[]
    boxId: string
}>()
const dialogVisible = defineModel({ default: false })
watch(props.dialogInfo, val => {
    console.log(val, "dialogInfo")
})
watchEffect(async () => {
    setOptions({
        title: {
            text: props.overViewTitle,
            left: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: function (params) {
                // params.data 是当前鼠标悬停的数据点的数据对象
                // 假设它包含 name, value, battery, 和 temperature 属性
                // let tooltipContent = ""
                // props.dialogInfo.forEach(item => {
                //     tooltipContent += `${params.data.name}<br/>值: ${item.value}<br/>电量: ${item.battery}%<br/>温度: ${item.temperature}°C`
                // })
                // return tooltipContent
                const battery = props.dialogInfo.find(
                    item => item.coord.boxName === params.data.name
                ).battery
                const temperature = props.dialogInfo.find(
                    item => item.coord.boxName === params.data.name
                ).temperature
                return `${params.data.name}<br/>当前设备电量:  ${battery}% <br/>当前设备温度:  ${temperature} °C`
            }
        },
        legend: {
            orient: "vertical",
            left: "left"
        },
        series: [
            {
                name: "该省冷链设备概览",
                type: "pie",
                radius: "50%",
                data: props.dialogInfo.map(item => {
                    return {
                        value: Math.floor(Math.random() * 100),
                        name: item.coord.boxName
                    }
                }),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }
        ]
    })
})
</script>

<style scoped lang="scss">
.box-chart {
    width: 100%;
    height: 60vh;
}
</style>
