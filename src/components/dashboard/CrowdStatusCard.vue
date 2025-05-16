<!-- src/components/dashboard/CrowdStatusCard.vue -->
<template>
  <div
      :class="[
      isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50',
      'rounded-lg shadow cursor-pointer transition-all duration-200'
    ]"
      @click="$emit('select', spot.poi_id)"
  >
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="font-bold text-lg">{{ spot.poi_name }}</h3>
        <span
            class="text-xs px-2 py-1 rounded-full text-white"
            :style="{ backgroundColor: crowdLevelInfo.color }"
        >
          {{ crowdLevelInfo.level }}
        </span>
      </div>
      <div :class="[
        'flex justify-between text-sm mb-4',
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      ]">
        <span>{{ spot.biz_cat_name }}</span>
        <span>{{ region }}</span>
      </div>
      <div :class="[
        'h-2 rounded-full overflow-hidden mb-4',
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      ]">
        <div
            class="h-full"
            :style="{
            width: `${spot.congestion}%`,
            backgroundColor: crowdLevelInfo.color
          }"
        />
      </div>
      <div class="flex justify-between items-center">
        <span>현재 혼잡도: {{ spot.congestion }}%</span>
        <span class="flex items-center">
          <Users class="h-4 w-4 mr-1" />
          {{ spot.visitor_count.toLocaleString() }}
        </span>
      </div>
    </div>
    <div
        :class="[
        'px-6 py-3 border-t flex justify-between items-center',
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      ]"
    >
      <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
        상세 정보 보기
      </span>
      <ChevronRight class="h-4 w-4" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Users, ChevronRight } from 'lucide-vue-next';
import type { TouristSpot, CrowdLevel } from '@/types';

export default defineComponent({
  name: 'CrowdStatusCard',
  components: {
    Users,
    ChevronRight
  },
  props: {
    spot: {
      type: Object as () => TouristSpot,
      required: true
    },
    dark: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select'],
  setup(props) {
    const getCrowdLevel = (level: number): CrowdLevel => {
      switch(level) {
        case 1: return { level: '여유', color: '#4CAF50' };
        case 2: return { level: '보통', color: '#2196F3' };
        case 3: return { level: '혼잡', color: '#FF9800' };
        case 4: return { level: '매우 혼잡', color: '#F44336' };
        default: return { level: '정보없음', color: '#9E9E9E' };
      }
    };

    const crowdLevelInfo = computed(() => getCrowdLevel(props.spot.congestion_level));

    const region = computed(() => props.spot.address.split(' ')[0]);

    return {
      crowdLevelInfo,
      region,
      isDarkMode: props.dark
    };
  }
});
</script>