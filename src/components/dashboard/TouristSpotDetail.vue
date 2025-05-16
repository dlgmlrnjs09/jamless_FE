<!-- src/components/dashboard/TouristSpotDetail.vue -->
<template>
  <div v-if="spot" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white', 'rounded-lg shadow mb-6']">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">{{ spot.poi_name }} 상세 혼잡도</h2>
        <div class="flex items-center space-x-4">
          <div :class="[
            'px-4 py-1 rounded-full text-xs',
            isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
          ]">
            <span class="font-medium">{{ spot.biz_cat_name }}</span>
          </div>
          <div :class="[
            'px-4 py-1 rounded-full text-xs',
            isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'
          ]">
            <span class="font-medium">{{ region }}</span>
          </div>
          <div class="flex items-center">
            <Users class="h-4 w-4 mr-1" />
            <span>{{ spot.visitor_count.toLocaleString() }} 방문</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div :class="[isDarkMode ? 'bg-gray-700' : 'bg-gray-50', 'rounded-lg p-4']">
          <h3 class="text-lg font-medium mb-2 flex items-center">
            <Users class="mr-2" /> 현재 혼잡도
          </h3>
          <div class="flex items-end space-x-2">
            <span class="text-3xl font-bold">{{ spot.congestion }}%</span>
            <span
                class="text-xs mb-1 px-2 py-1 rounded-full text-white"
                :style="{ backgroundColor: crowdLevelInfo.color }"
            >
              {{ crowdLevelInfo.level }}
            </span>
          </div>
        </div>

        <div :class="[isDarkMode ? 'bg-gray-700' : 'bg-gray-50', 'rounded-lg p-4']">
          <h3 class="text-lg font-medium mb-2 flex items-center">
            <TrendingUp class="mr-2" /> 예상 최대 혼잡도
          </h3>
          <div class="flex items-end space-x-2">
            <span class="text-3xl font-bold">
              {{ maxForecastCongestion }}%
            </span>
            <span class="text-xs text-gray-500">
              {{ maxForecastDate }}
            </span>
          </div>
        </div>

        <div :class="[isDarkMode ? 'bg-gray-700' : 'bg-gray-50', 'rounded-lg p-4']">
          <h3 class="text-lg font-medium mb-2 flex items-center">
            <Calendar class="mr-2" /> 오늘 총 방문자
          </h3>
          <div class="flex items-end space-x-2">
            <span class="text-3xl font-bold">{{ spot.visitor_count.toLocaleString() }}</span>
            <span class="text-xs text-gray-500">명</span>
          </div>
        </div>

        <div :class="[isDarkMode ? 'bg-gray-700' : 'bg-gray-50', 'rounded-lg p-4']">
          <h3 class="text-lg font-medium mb-2 flex items-center">
            <Sun class="mr-2" /> 날씨 정보
          </h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold">{{ spot.weather.tempmax }}°C</span>
            <div>
              <div class="text-sm">{{ spot.weather.conditions }}</div>
              <div class="text-xs text-gray-500">습도: {{ spot.weather.humidity }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <crowd-history-chart
            :past-data="pastCrowdData"
            :dark="isDarkMode"
            title="과거 혼잡도 이력"
        />
        <crowd-history-chart
            :past-data="forecastCrowdData"
            :dark="isDarkMode"
            title="향후 혼잡도 예측"
            :forecast="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Users, TrendingUp, Calendar, Sun } from 'lucide-vue-next';
import CrowdHistoryChart from '../charts/CrowdHistoryChart.vue';
import type { TouristSpot, CrowdLevel, ChartData } from '@/types';

export default defineComponent({
  name: 'TouristSpotDetail',
  components: {
    Users, TrendingUp, Calendar, Sun, CrowdHistoryChart
  },
  props: {
    spot: {
      type: Object as () => TouristSpot | null,
      default: null
    },
    dark: {
      type: Boolean,
      default: true
    }
  },
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

    return {
      crowdLevelInfo,
      region,
      pastCrowdData,
      forecastCrowdData,
      maxForecastCongestion,
      maxForecastDate,
      isDarkMode: props.dark
    };
  }
});
</script>