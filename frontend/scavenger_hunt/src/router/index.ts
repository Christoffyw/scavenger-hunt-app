import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: () => import("../components/LoginPanel.vue"),
        },
        {
            path: "/session/:group_name",
            component: () => import("../components/UserView.vue"),
        },
        {
            path: "/:catchAll(.*)",
            component: () => import("../components/404View.vue"),
        },
    ],
});

export default router;