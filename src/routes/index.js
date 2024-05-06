import {
    createMemoryHistory,
    createRouter,
    createWebHistory,
} from "vue-router";

import MainPage from "../pages/MainPage.vue";
import HashTags from "../pages/HashtagsPage.vue";
import CreatorsPage from "../pages/CreatorsPage.vue";
import GroupsPage from "../pages/GroupsPage.vue";
import PointsPage from "../pages/PointsPage.vue";
import GuidePage from "../pages/GuidePage.vue";
import DocumentPage from "../pages/DocumentationPage.vue";

export const routes = [
    { path: "/", redirect: "/about" },
    { path: "/about", name: "About", component: MainPage },
    { path: "/hashtags", name: "Hashtags", component: HashTags },
    { path: "/creators", name: "Creators", component: CreatorsPage },
    { path: "/groups", name: "Groups", component: GroupsPage },
    { path: "/points", name: "Points", component: PointsPage },
    { path: "/guide", name: "Guide", component: GuidePage },
    { path: "/documentation", name: "Documentation", component: DocumentPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
