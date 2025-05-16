<!-- src/components/dashboard/TouristSpotGrid.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <crowd-status-card
        v-for="spot in spots"
        :key="spot.poi_id"
        :spot="spot"
        :dark="dark"
        @select="$emit('select', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CrowdStatusCard from './CrowdStatusCard.vue';
import type { TouristSpot } from '@/types';

export default defineComponent({
  name: 'TouristSpotGrid',
  components: {
    CrowdStatusCard
  },
  props: {
    spots: {
      type: Array as () => TouristSpot[],
      required: true
    },
    dark: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select']
});
</script>