<template>
    <div class="wrapper">
        <main>
            <animated-canvas></animated-canvas>
        </main>
        <activity-list></activity-list>
    </div>
</template>

<script>
import ActivityList from '../components/ActivityList.vue';
import AnimatedCanvas from '../components/AnimatedCanvas.vue';
export default {
    components: {
        ActivityList, AnimatedCanvas
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

        canvas {
            width: 100%;
            height: 100%;
        }
    }
}
</style>