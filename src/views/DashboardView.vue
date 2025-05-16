<!-- src/views/DashboardView.vue -->
<template>
  <div :class="[darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800', 'h-screen']">
    <sidebar
        v-model="sidebarOpen"
        v-model:dark="darkMode"
    />

    <div :class="[
      'flex-1',
      sidebarOpen ? 'ml-64' : 'ml-20',
      'transition-all duration-300 ease-in-out'
    ]">
      <app-header :dark="darkMode" />

      <main :class="['p-6', darkMode ? 'bg-gray-900' : 'bg-gray-100', 'min-h-screen']">
        <!-- 페이지 타이틀 및 필터 -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
            <h2 class="text-2xl font-bold">관광지 혼잡도 현황</h2>
            <div class="flex flex-wrap gap-3">
              <div>
                <select
                    :class="[
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-gray-200'
                      : 'bg-white border-gray-300 text-gray-700',
                    'border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  ]"
                    v-model="selectedCategory"
                >
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              <div>
                <select
                    :class="[
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-gray-200'
                      : 'bg-white border-gray-300 text-gray-700',
                    'border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  ]"
                    v-model="selectedRegion"
                >
                  <option v-for="region in regions" :key="region" :value="region">
                    {{ region }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <Clock class="mr-2" :size="18" />
                <span class="text-sm">마지막 업데이트: {{ lastUpdate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 요약 통계 -->
        <stats-summary :spots="touristSpots" :dark="darkMode" />

        <!-- 관광지 그리드 -->
        <tourist-spot-grid
            :spots="filteredSpots"
            :dark="darkMode"
            @select="selectSpot"
        />

        <!-- 선택된 관광지 상세 정보 -->
        <tourist-spot-detail
            v-if="selectedSpot"
            :spot="selectedSpot"
            :dark="darkMode"
        />

        <!-- 지역별 평균 혼잡도 차트 -->
        <div :class="[darkMode ? 'bg-gray-800' : 'bg-white', 'p-6 rounded-lg shadow']">
          <h2 class="text-xl font-bold mb-4">지역별 평균 혼잡도</h2>
          <div class="h-64">
            <bar-chart
                :chart-data="regionChartData"
                :chart-options="regionChartOptions"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { Clock } from 'lucide-vue-next';
import {BarChart} from "lucide-vue-next";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '@/components/layout/Sidebar.vue';
import AppHeader from '@/components/layout/Header.vue';
import StatsSummary from '@/components/dashboard/StatsSummary.vue';
import TouristSpotGrid from '@/components/dashboard/TouristSpotGrid.vue';
import TouristSpotDetail from '@/components/dashboard/TouristSpotDetail.vue';
import type { TouristSpot } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 샘플 데이터 (실제로는 API에서 가져옴)
const sampleData: TouristSpot[] = [
  {
    poi_id: 'POI001',
    poi_name: '경복궁',
    congestion: 75,
    congestion_level: 3,
    visitor_count: 12540,
    biz_cat_name: '고궁',
    address: '서울특별시 종로구',
    past_data: [
      { visit_date: '2025-05-15', approx_visitor_count: 1200, congestion: 65 },
      { visit_date: '2025-05-14', approx_visitor_count: 1450, congestion: 80 },
      { visit_date: '2025-05-13', approx_visitor_count: 1350, congestion: 75 },
      { visit_date: '2025-05-12', approx_visitor_count: 1100, congestion: 60 },
      { visit_date: '2025-05-11', approx_visitor_count: 900, congestion: 50 },
    ],
    forecast_data: [
      { forecast_date: '2025-05-17', predicted_congestion: 70 },
      { forecast_date: '2025-05-18', predicted_congestion: 80 },
      { forecast_date: '2025-05-19', predicted_congestion: 90 },
      { forecast_date: '2025-05-20', predicted_congestion: 65 },
      { forecast_date: '2025-05-21', predicted_congestion: 55 },
    ],
    weather: { tempmax: 25.5, tempmin: 18.2, conditions: '맑음', humidity: 65 }
  },
  {
    poi_id: 'POI002',
    poi_name: '해운대 해수욕장',
    congestion: 85,
    congestion_level: 4,
    visitor_count: 10890,
    biz_cat_name: '해변',
    address: '부산광역시 해운대구',
    past_data: [
      { visit_date: '2025-05-15', approx_visitor_count: 2200, congestion: 60 },
      { visit_date: '2025-05-14', approx_visitor_count: 2750, congestion: 75 },
      { visit_date: '2025-05-13', approx_visitor_count: 3100, congestion: 85 },
      { visit_date: '2025-05-12', approx_visitor_count: 3300, congestion: 90 },
      { visit_date: '2025-05-11', approx_visitor_count: 3100, congestion: 85 },
    ],
    forecast_data: [
      { forecast_date: '2025-05-17', predicted_congestion: 80 },
      { forecast_date: '2025-05-18', predicted_congestion: 85 },
      { forecast_date: '2025-05-19', predicted_congestion: 90 },
      { forecast_date: '2025-05-20', predicted_congestion: 95 },
      { forecast_date: '2025-05-21', predicted_congestion: 85 },
    ],
    weather: { tempmax: 24.8, tempmin: 19.5, conditions: '구름조금', humidity: 70 }
  },
  // 여기에 더 많은 샘플 데이터 추가 가능
];

export default defineComponent({
  name: 'DashboardView',
  components: {
    Sidebar,
    AppHeader,
    StatsSummary,
    TouristSpotGrid,
    TouristSpotDetail,
    Clock,
    BarChart
  },
  setup() {
    const darkMode = ref(true);
    const sidebarOpen = ref(true);
    const selectedCategory = ref('전체');
    const selectedRegion = ref('전체');
    const selectedSpotId = ref<string | null>(null);
    const touristSpots = ref<TouristSpot[]>([]);
    const lastUpdate = ref('2025-05-16 14:30');

    // 관광지 데이터 로드 (실제로는 API 호출)
    onMounted(() => {
      // API 호출 대신 샘플 데이터 사용
      touristSpots.value = sampleData;
    });

    // 카테고리 및 지역 옵션 추출
    const categories = computed(() => {
      const uniqueCategories = new Set(touristSpots.value.map(spot => spot.biz_cat_name));
      return ['전체', ...Array.from(uniqueCategories)];
    });

    const regions = computed(() => {
      const uniqueRegions = new Set(touristSpots.value.map(spot => spot.address.split(' ')[0]));
      return ['전체', ...Array.from(uniqueRegions)];
    });

    // 필터링된 관광지 목록
    const filteredSpots = computed(() => {
      return touristSpots.value.filter(spot =>
          (selectedCategory.value === '전체' || spot.biz_cat_name === selectedCategory.value) &&
          (selectedRegion.value === '전체' || spot.address.includes(selectedRegion.value))
      );
    });

    // 선택된 관광지 상세 정보
    const selectedSpot = computed(() => {
      if (!selectedSpotId.value) return null;
      return touristSpots.value.find(spot => spot.poi_id === selectedSpotId.value) || null;
    });

    // 선택된 관광지 설정
    const selectSpot = (poiId: string) => {
      selectedSpotId.value = poiId;
    };

    // 지역별 평균 혼잡도 차트 데이터
    const regionChartData = computed(() => {
      const regionsData = regions.value
          .filter(r => r !== '전체')
          .map(region => {
            const spotsInRegion = touristSpots.value.filter(spot =>
                spot.address.includes(region)
            );
            const avgCongestion = Math.round(
                spotsInRegion.reduce((sum, spot) => sum + spot.congestion, 0) /
                spotsInRegion.length
            );
            return { region, avgCongestion };
          });

      return {
        labels: regionsData.map(r => r.region),
        datasets: [
          {
            label: '평균 혼잡도',
            data: regionsData.map(r => r.avgCongestion),
            backgroundColor: '#3f51b5',
          }
        ]
      };
    });

    // 지역별 평균 혼잡도 차트 옵션
    const regionChartOptions = computed(() => {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: darkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: darkMode.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }
          },
          x: {
            grid: {
              color: darkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: darkMode.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: darkMode.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }
          }
        }
      };
    });

    return {
      darkMode,
      sidebarOpen,
      selectedCategory,
      selectedRegion,
      categories,
      regions,
      touristSpots,
      filteredSpots,
      selectSpot,
      selectedSpot,
      lastUpdate,
      regionChartData,
      regionChartOptions
    };
  }
});
</script>