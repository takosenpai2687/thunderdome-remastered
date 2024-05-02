<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>

<script>
import MainLayout from './layouts/MainLayout.vue';
import { RouterView } from 'vue-router';
export default {
  setup() {

    return {}
  },
  components: {
    MainLayout, RouterView
  }
}
</script>

<style lang="scss" scoped></style>