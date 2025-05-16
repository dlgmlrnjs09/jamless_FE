<!-- src/components/dashboard/StatsSummary.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    <div v-for="(stat, index) in stats" :key="index"
         :class="[isDarkMode ? 'bg-gray-800' : 'bg-white', 'rounded-lg shadow p-6']"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">{{ stat.title }}</h3>
        <component :is="stat.icon" :class="stat.iconColor" />
      </div>
      <p class="text-3xl font-bold">{{ stat.value }}</p>
      <p :class="['text-sm mt-2', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
        {{ stat.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { MapPin, Activity, Users, TrendingUp } from 'lucide-vue-next';
import type { TouristSpot } from '@/types';

export default defineComponent({
  name: 'StatsSummary',
  components: {
    MapPin, Activity, Users, TrendingUp
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
  setup(props) {
    const totalVisitors = computed(() =>
        props.spots.reduce((sum, spot) => sum + spot.visitor_count, 0).toLocaleString()
    );

    const avgCongestion = computed(() =>
        Math.round(props.spots.reduce((sum, spot) => sum + spot.congestion, 0) / props.spots.length)
    );

    const crowdedSpots = computed(() =>
        props.spots.filter(spot => spot.congestion_level >= 3).length
    );

    const stats = computed(() => [
      {
        title: '관광지 수',
        value: props.spots.length,
        description: '모니터링 중인 관광지',
        icon: MapPin,
        iconColor: 'text-blue-500'
      },
      {
        title: '평균 혼잡도',
        value: `${avgCongestion.value}%`,
        description: '전체 관광지 기준',
        icon: Activity,
        iconColor: 'text-orange-500'
      },
      {
        title: '혼잡 관광지',
        value: crowdedSpots.value,
        description: '혼잡 또는 매우 혼잡 상태',
        icon: Users,
        iconColor: 'text-red-500'
      },
      {
        title: '총 방문자',
        value: totalVisitors.value,
        description: '오늘 총 방문자 수',
        icon: TrendingUp,
        iconColor: 'text-green-500'
      }
    ]);

    return {
      stats,
      isDarkMode: props.dark
    };
  }
});
</script>