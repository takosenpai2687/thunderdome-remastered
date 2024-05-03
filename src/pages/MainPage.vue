<template>
    <div class="wrapper">
        <main></main>
        <activity-list></activity-list>
    </div>
</template>

<script>
import ActivityList from '../components/ActivityList.vue';
export default {
    components: {
        ActivityList
    },
}
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

.wrapper {
    display: flex;
    height: 100%;
    width: 100%;

    main {
        width: calc(100% - $activity-list-width);
        height: 100%;
        background-color: transparent;
    }
}
</style>