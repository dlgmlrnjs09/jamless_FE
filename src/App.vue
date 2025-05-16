<!-- src/App.vue -->
<template>
  <dashboard-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DashboardView from '@/views/DashboardView.vue';

export default defineComponent({
  name: 'App',
  components: {
    DashboardView
  }
});
</script>