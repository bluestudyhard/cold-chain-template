<!--
 * new page
 * @author: blue
 * @since: 2024-06-17
 * OverView.vue
-->
<template>
    <div class="container">
        <div ref="chartRef" style="width: 100%; height: 90vh" />
    </div>
</template>

<script setup lang="ts">
import { useECharts } from "@pureadmin/utils"
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, echarts } = useECharts(chartRef)
import { getCityPositionByName } from "@/charts/getCityPositionByName"
import "@/charts/china.js"
const mockData = ref([
    { name: "北京", value: 14400 },
    { name: "天津", value: 200 },
    { name: "河南", value: 300 },
    { name: "广西", value: 300 },
    { name: "广东", value: 300 },
    { name: "河北", value: 300 }
])
const data = ref([])
onMounted(() => {
    data.value = mockData.value.map(item => {
        return {
            name: item.name,
            value: item.value,
            coord: getCityPositionByName(item.name)
        }
    })
    setOptions(
        {
            backgroundColor: "transparent", // 设置背景色透明
            // 必须设置
            tooltip: {
                show: true
            },
            geo: {
                tooltip: {
                    show: false
                },
                map: "china",
                roam: false, // 开启鼠标缩放和平移
                label: {
                    show: false
                },
                top: "0.5%",
                left: "center",
                aspectScale: 0.75,
                itemStyle: {
                    borderColor: "#EDF1F5", // 省分界线颜色
                    borderWidth: 1,
                    opacity: 1,
                    shadowBlur: 10,
                    shadowColor: "#c7c7c7c2",
                    shadowOffsetX: 1,
                    shadowOffsetY: 1
                }
            },

            series: [
                // 地图配置
                {
                    type: "map",
                    map: "china",
                    zoom: 1,
                    tooltip: {
                        show: true,
                        formatter: params => {
                            return params.name + ":" + params.value
                            // return `<div style="color: #fff; background-color: #333; padding: 10px;"><h4 style="margin: 0;">${params.name}</h4></div>`
                        }
                    },
                    label: {
                        show: true, // 显示省份名称
                        color: "#F0F2F5",
                        align: "center",
                        fontSize: 12,
                        position: "inside"
                    },
                    top: "0%",
                    left: "center",
                    aspectScale: 0.75,
                    roam: "scale", // 地图缩放和平移
                    progressive: 0,
                    itemStyle: {
                        borderColor: "#D5DAE9", // 省分界线颜色  阴影效果的
                        borderWidth: 1,
                        // areaColor: new echarts.graphic.LinearGradient(
                        //     0,
                        //     0,
                        //     1,
                        //     0,
                        //     [
                        //         {
                        //             offset: 0,
                        //             color: "#FEFEDF" // 0% 处的颜色
                        //         },

                        //         {
                        //             offset: 1,
                        //             color: "#00619A" // 0% 处的颜色
                        //         }
                        //     ]
                        // ),
                        areaColor: "#4280C7",
                        opacity: 1
                    },
                    // 去除选中状态
                    select: {
                        disabled: true
                    },
                    // 控制鼠标悬浮上去的效果
                    emphasis: {
                        // 聚焦后颜色
                        disabled: false, // 开启高亮
                        label: {
                            align: "center",
                            color: "#ffffff"
                        },
                        itemStyle: {
                            color: "#ffffff",
                            areaColor: "#0075f4" // 阴影效果 鼠标移动上去的颜色
                        }
                    },
                    z: 2,
                    data: data.value
                },
                {
                    type: "scatter",
                    coordinateSystem: "geo",
                    symbol: "pin",
                    symbolSize: [50, 50],
                    label: {
                        show: true,
                        color: "#fff",
                        formatter: "{b}"
                    },
                    itemStyle: {
                        color: "#e30707" //标志颜色
                    },
                    z: 2,
                    data: data.value
                }
            ]
        },
        {
            name: "click",
            callback: (params: any) => {
                console.log(params)
            }
        }
    )
})
onUnmounted(() => {
    chartRef.value = null
})
</script>
