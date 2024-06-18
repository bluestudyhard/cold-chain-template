export default {
    path: "/admin",
    meta: {
        title: "管理系统",
        icon: "ri:admin-line",
        rank: 9,
        showLink: true
    },
    children: [
        {
            path: "/admin/device",
            name: "AdminDevice",
            meta: {
                title: "设备管理",
                roles: ["admin"]
            },
            component: () => import("@/views/admin/device/index.vue")
        },
        {
            path: "/admin/health",
            name: "AdminHealth",
            meta: {
                title: "设备健康",
                roles: ["admin"]
            },
            component: () => import("@/views/admin/health/index.vue")
        },
        {
            path: "/admin/warn",
            name: "AdminWarn",
            meta: {
                title: "设备预警",
                roles: ["admin"]
            },
            component: () => import("@/views/admin/warn/index.vue")
        },
        {
            path: "/admin/vaccine",
            name: "AdminVaccine",
            meta: {
                title: "疫苗管理",
                roles: ["admin"]
            },
            component: () => import("@/views/admin/vaccine/index.vue")
        }
    ]
} as RouteConfigsTable
