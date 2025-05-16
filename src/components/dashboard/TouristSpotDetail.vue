<!-- src/components/dashboard/TouristSpotDetail.vue -->
<template>
  <div v-if="spot" class="bg-gradient-to-br from-[#232627] to-[#1A1D1F] rounded-lg overflow-hidden mb-6">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">{{ spot.poi_name }} 상세 혼잡도</h2>
        <div class="flex items-center space-x-3">
          <div class="px-3 py-1 bg-blue-500 bg-opacity-20 rounded-full text-blue-400 text-xs">
            {{ spot.biz_cat_name }}
          </div>
          <div class="px-3 py-1 bg-purple-500 bg-opacity-20 rounded-full text-purple-400 text-xs">
            {{ region }}
          </div>
          <div class="flex items-center text-gray-400 text-xs">
            <Users class="w-3.5 h-3.5 mr-1.5" />
            <span>{{ spot.visitor_count.toLocaleString() }} 방문</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-[#1A1D1F] rounded-lg p-4">
          <h3 class="text-gray-400 text-sm mb-3 flex items-center">
            <Users class="w-4 h-4 mr-2 text-blue-400" /> 현재 혼잡도
          </h3>
          <div class="flex items-end space-x-2">
            <span class="text-white text-2xl font-bold">{{ spot.congestion }}%</span>
            <span
                class="text-xs px-2 py-0.5 rounded-full"
                :style="{ backgroundColor: `${crowdLevelInfo.color}25` }"
                :class="{
                'text-green-400': crowdLevelInfo.level === '여유',
                'text-blue-400': crowdLevelInfo.level === '보통',
                'text-orange-400': crowdLevelInfo.level === '혼잡',
                'text-red-400': crowdLevelInfo.level === '매우 혼잡'
              }"
            >
              {{ crowdLevelInfo.level }}
            </span>
          </div>
        </div>

        <div class="bg-[#1A1D1F] rounded-lg p-4">
          <h3 class="text-gray-400 text-sm mb-3 flex items-center">
            <TrendingUp class="w-4 h-4 mr-2 text-orange-400" /> 예상 최대 혼잡도
          </h3>
          <div class="flex items-end space-x-2">
            <span class="text-white text-2xl font-bold">
              {{ maxForecastCongestion }}%
            </span>
            <span class="text-xs text-gray-500">
              {{ maxForecastDate }}
            </span>
          </div>
        </div>

        <div class="bg-[#1A1D1F] rounded-lg p-4">
          <h3 class="text-gray-400 text-sm mb-3 flex items-center">
            <Calendar class="w-4 h-4 mr-2 text-green-400" /> 오늘 총 방문자
          </h3>
          <div class="flex items-end space-x-2">
            <span class="text-white text-2xl font-bold">{{ spot.visitor_count.toLocaleString() }}</span>
            <span class="text-xs text-gray-500">명</span>
          </div>
        </div>

        <div class="bg-[#1A1D1F] rounded-lg p-4">
          <h3 class="text-gray-400 text-sm mb-3 flex items-center">
            <Sun class="w-4 h-4 mr-2 text-yellow-400" /> 날씨 정보
          </h3>
          <div class="flex items-center justify-between">
            <span class="text-white text-2xl font-bold">{{ spot.weather.tempmax }}°C</span>
            <div>
              <div class="text-sm text-gray-300">{{ spot.weather.conditions }}</div>
              <div class="text-xs text-gray-500">습도: {{ spot.weather.humidity }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-[#1A1D1F] rounded-lg p-4">
          <h3 class="text-gray-300 text-sm font-medium mb-4">과거 혼잡도 이력</h3>
          <div class="h-64">
            <crowd-history-chart
                :past-data="pastCrowdData"
                title="과거 혼잡도 이력"
            />
          </div>
        </div>

        <div class="bg-[#1A1D1F] rounded-lg p-4">
          <h3 class="text-gray-300 text-sm font-medium mb-4">향후 혼잡도 예측</h3>
          <div class="h-64">
            <crowd-history-chart
                :past-data="forecastCrowdData"
                title="향후 혼잡도 예측"
                :forecast="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Users, TrendingUp, Calendar, Sun } from 'lucide-vue-next';
import CrowdHistoryChart from '../charts/CrowdHistoryChart.vue';
import type { TouristSpot, CrowdLevel, ChartData } from '@/types';

// props 정의
const props = defineProps({
  spot: {
    type: Object as () => TouristSpot | null,
    default: null
  }
});

const getCrowdLevel = (level: number): CrowdLevel => {
  switch(level) {
    case 1: return { level: '여유', color: '#4CAF50' };
    case 2: return { level: '보통', color: '#2196F3' };
    case 3: return { level: '혼잡', color: '#FF9800' };
    case 4: return { level: '매우 혼잡', color: '#F44336' };
    default: return { level: '정보없음', color: '#9E9E9E' };
  }
};

const crowdLevelInfo = computed(() => {
  if (!props.spot) return { level: '', color: '' };
  return getCrowdLevel(props.spot.congestion_level);
});

const region = computed(() => {
  if (!props.spot) return '';
  return props.spot.address.split(' ')[0];
});

const pastCrowdData = computed(() => {
  if (!props.spot) return [];
  return props.spot.past_data.map(data => ({
    day: data.visit_date.substring(5),
    혼잡도: data.congestion,
    방문자수: data.approx_visitor_count
  })).reverse();
});

const forecastCrowdData = computed(() => {
  if (!props.spot) return [];
  return props.spot.forecast_data.map(data => ({
    day: data.forecast_date.substring(5),
    예상혼잡도: data.predicted_congestion
  }));
});

const maxForecastCongestion = computed(() => {
  if (!props.spot) return 0;
  return Math.max(...props.spot.forecast_data.map(d => d.predicted_congestion));
});

const maxForecastDate = computed(() => {
  if (!props.spot) return '';
  const maxCongestion = maxForecastCongestion.value;
  const maxDate = props.spot.forecast_data.find(d => d.predicted_congestion === maxCongestion);
  return maxDate ? maxDate.forecast_date.substring(5) : '';
});
</script>