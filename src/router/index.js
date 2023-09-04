import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/user",
        component: () => import("@/layouts/default/Default.vue"),
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("@/views/user/MainMap.vue"),
                children: [
                    {
                        path: "",
                        redirect: "map",
                    }, {
                        path: "map",
                        name: "Map",
                        component: () => import("@/components/Map.vue"),
                    }, {
                        path: "search",
                        name: "SearchResults",
                        component: () =>
                            import("@/components/SearchResults.vue"),
                    },
                ],
            }, {
                path: "add-card",
                name: "AddPaymentMethod",
                component: () => import("@/views/user/AddPaymentMethod.vue"),
            },
        ],
    }, {
        path: "/driver",
        component: () => import("@/layouts/default/Default.vue"),
        children: [
            {
                path: "map",
                name: "DriverMap",
                component: () => import("@/views/driver/MainMap.vue"),
            },
        ],
    }, {
        path: "/user-token/:token",
        name: "getUserToken",
        component: () => import("@/views/TokenHandlers/UserTokenRedirect.vue"),
    }, {
        path: "/driver-token/:token",
        name: "getDriverToken",
        component: () => import("@/views/TokenHandlers/DriverTokenRedirect.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
