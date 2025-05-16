<!-- src/views/DashboardView.vue -->
<template>
  <div class="flex bg-[#0f1112] text-white min-h-screen">
    <!-- 사이드바 -->
    <sidebar />

    <!-- 메인 콘텐츠 -->
    <div class="flex-1 ml-56">
      <!-- 상단 헤더 -->
      <header class="bg-[#151718] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <BarChart2 class="text-blue-500 mr-2" size="18" />
          <h1 class="text-white font-bold">대시보드</h1>
          <div class="ml-3 px-3 py-1 bg-blue-500 bg-opacity-20 rounded-full text-blue-400 text-xs font-medium">
            실시간 데이터
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size="16" />
            <input
                type="text"
                placeholder="관광지 검색..."
                class="bg-[#1A1D1F] border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-64 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div class="flex items-center text-gray-400 text-sm">
            <Clock class="mr-2" size="16" />
            <span>마지막 업데이트: {{ lastUpdate }}</span>
          </div>
        </div>
      </header>

      <!-- 컨텐츠 영역 -->
      <main class="p-6">
        <!-- 카테고리 필터 -->
        <div class="mb-6">
          <div class="flex space-x-2 overflow-x-auto pb-2">
            <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                :class="[
                'px-4 py-2 text-sm rounded-lg whitespace-nowrap',
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1A1D1F] text-gray-300 hover:bg-[#232627]'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- 요약 카드 그리드 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
              v-for="(stat, index) in summaryStats"
              :key="index"
              class="bg-gradient-to-br from-[#232627] to-[#1A1D1F] rounded-lg p-5"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" :style="{ backgroundColor: `${stat.color}25` }">
                  <component :is="stat.icon" class="w-4 h-4" :style="{ color: stat.color }" />
                </div>
                <h3 class="text-gray-300 font-medium text-sm">{{ stat.title }}</h3>
              </div>
            </div>
            <div class="flex items-end">
              <span class="text-white text-2xl font-bold">{{ stat.value }}</span>
              <span v-if="stat.unit" class="ml-1 text-gray-400 text-sm">{{ stat.unit }}</span>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ stat.description }}</p>
          </div>
        </div>

        <!-- 실시간 혼잡도 차트 -->
        <div class="bg-[#1A1D1F] rounded-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-white">실시간 혼잡도 추이</h2>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <select
                    v-model="selectedChartCategory"
                    class="bg-[#232627] border-none rounded-lg px-4 py-2 pr-8 text-sm text-gray-300 focus:outline-none appearance-none"
                >
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <ChevronDown class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div class="h-80">
            <real-time-chart
                :chart-data="realTimeChartData"
                :category="selectedChartCategory"
            />
          </div>
        </div>

        <!-- 인기 있는 관광지 및 여유로운 관광지 TOP 10 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- 인기 있는 관광지 TOP 10 -->
          <div class="bg-gradient-to-br from-[#232627] to-[#1A1D1F] rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-800">
              <h2 class="text-lg font-bold text-white">인기 있는 관광지 TOP 10</h2>
              <p class="text-xs text-gray-400 mt-1">현재 혼잡도 기준</p>
            </div>
            <div class="divide-y divide-gray-800">
              <div
                  v-for="(spot, index) in popularSpots"
                  :key="spot.poi_id"
                  class="px-6 py-4 flex items-center hover:bg-[#1A1D1F] cursor-pointer transition-colors"
                  @click="goToSpotDetail(spot.poi_id)"
              >
                <div class="w-6 h-6 bg-[#232627] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span class="text-xs font-medium text-gray-300">{{ index + 1 }}</span>
                </div>
                <div class="flex-grow min-w-0">
                  <h3 class="text-white font-medium text-sm truncate">{{ spot.poi_name }}</h3>
                  <div class="flex items-center text-xs text-gray-400 mt-1">
                    <span>{{ spot.biz_cat_name }}</span>
                    <div class="w-1 h-1 bg-gray-600 rounded-full mx-2"></div>
                    <span>{{ spot.address.split(' ')[0] }}</span>
                  </div>
                </div>
                <div class="flex items-center ml-4">
                  <div class="text-right">
                    <div
                        class="text-sm font-medium"
                        :class="{
                        'text-green-400': spot.congestion_level === 1,
                        'text-blue-400': spot.congestion_level === 2,
                        'text-orange-400': spot.congestion_level === 3,
                        'text-red-400': spot.congestion_level === 4
                      }"
                    >
                      {{ spot.congestion }}%
                    </div>
                    <div class="text-xs text-gray-500">{{ getCrowdLevel(spot.congestion_level).level }}</div>
                  </div>
                  <ChevronRight class="w-4 h-4 text-gray-500 ml-4" />
                </div>
              </div>
            </div>
          </div>

          <!-- 여유로운 관광지 TOP 10 -->
          <div class="bg-gradient-to-br from-[#232627] to-[#1A1D1F] rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-800">
              <h2 class="text-lg font-bold text-white">여유로운 관광지 TOP 10</h2>
              <p class="text-xs text-gray-400 mt-1">현재 혼잡도 기준</p>
            </div>
            <div class="divide-y divide-gray-800">
              <div
                  v-for="(spot, index) in relaxedSpots"
                  :key="spot.poi_id"
                  class="px-6 py-4 flex items-center hover:bg-[#1A1D1F] cursor-pointer transition-colors"
                  @click="goToSpotDetail(spot.poi_id)"
              >
                <div class="w-6 h-6 bg-[#232627] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span class="text-xs font-medium text-gray-300">{{ index + 1 }}</span>
                </div>
                <div class="flex-grow min-w-0">
                  <h3 class="text-white font-medium text-sm truncate">{{ spot.poi_name }}</h3>
                  <div class="flex items-center text-xs text-gray-400 mt-1">
                    <span>{{ spot.biz_cat_name }}</span>
                    <div class="w-1 h-1 bg-gray-600 rounded-full mx-2"></div>
                    <span>{{ spot.address.split(' ')[0] }}</span>
                  </div>
                </div>
                <div class="flex items-center ml-4">
                  <div class="text-right">
                    <div
                        class="text-sm font-medium"
                        :class="{
                        'text-green-400': spot.congestion_level === 1,
                        'text-blue-400': spot.congestion_level === 2,
                        'text-orange-400': spot.congestion_level === 3,
                        'text-red-400': spot.congestion_level === 4
                      }"
                    >
                      {{ spot.congestion }}%
                    </div>
                    <div class="text-xs text-gray-500">{{ getCrowdLevel(spot.congestion_level).level }}</div>
                  </div>
                  <ChevronRight class="w-4 h-4 text-gray-500 ml-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 실시간 사용자 댓글 -->
        <div class="bg-gradient-to-br from-[#232627] to-[#1A1D1F] rounded-lg overflow-hidden mb-8">
          <div class="px-6 py-4 border-b border-gray-800">
            <h2 class="text-lg font-bold text-white">실시간 사용자 댓글</h2>
            <p class="text-xs text-gray-400 mt-1">최근 작성된 사용자 후기</p>
          </div>
          <div class="divide-y divide-gray-800">
            <div
                v-for="(comment, index) in userComments"
                :key="index"
                class="p-6"
            >
              <div class="flex">
                <div class="flex-shrink-0 mr-4">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span class="text-white font-medium">{{ comment.userName.charAt(0) }}</span>
                  </div>
                </div>
                <div class="flex-grow">
                  <div class="flex items-center">
                    <h3 class="text-white font-medium">{{ comment.userName }}</h3>
                    <div class="mx-2 w-1 h-1 bg-gray-600 rounded-full"></div>
                    <div class="text-xs text-gray-400">{{ comment.spotName }}</div>
                    <div class="ml-auto text-xs text-gray-500">{{ comment.timestamp }}</div>
                  </div>
                  <div class="mt-2 text-sm text-gray-300">
                    {{ comment.content }}
                  </div>
                  <div v-if="comment.imageSrc" class="mt-3">
                    <img :src="comment.imageSrc" :alt="comment.spotName" class="rounded-lg max-h-64 object-cover" />
                  </div>
                  <div class="mt-3 flex items-center">
                    <button class="flex items-center text-gray-400 hover:text-blue-400">
                      <ThumbsUp class="w-4 h-4 mr-1" />
                      <span class="text-xs">{{ comment.likes }}</span>
                    </button>
                    <button class="flex items-center text-gray-400 hover:text-blue-400 ml-4">
                      <MessageSquare class="w-4 h-4 mr-1" />
                      <span class="text-xs">답글</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-800 text-center">
            <button class="text-blue-400 text-sm hover:text-blue-300">더 많은 댓글 보기</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { BarChart2, Search, Clock, ChevronDown, ChevronRight, ThumbsUp, MessageSquare, Users, Activity, AlertCircle, MapPin } from 'lucide-vue-next';
import Sidebar from '@/components/layout/Sidebar.vue';
import RealTimeChart from '@/components/charts/RealTimeChart.vue';
import { useRouter } from 'vue-router';

// 타입 정의
interface TouristSpot {
  poi_id: string;
  poi_name: string;
  congestion: number;
  congestion_level: number;
  visitor_count: number;
  biz_cat_name: string;
  address: string;
  past_data: {
    visit_date: string;
    approx_visitor_count: number;
    congestion: number;
  }[];
  forecast_data: {
    forecast_date: string;
    predicted_congestion: number;
  }[];
  weather: {
    tempmax: number;
    tempmin: number;
    conditions: string;
    humidity: number;
  };
}

interface CrowdLevel {
  level: string;
  color: string;
}

interface UserComment {
  userName: string;
  spotName: string;
  content: string;
  timestamp: string;
  likes: number;
  imageSrc: string | null;
}

// 라우터 설정
const router = useRouter();

// 상태 관리
const selectedCategory = ref('전체');
const selectedChartCategory = ref('전체');
const touristSpots = ref<TouristSpot[]>([]);
const lastUpdate = ref('2025-05-16 14:30');

// 샘플 데이터
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
  // 더 많은 샘플 데이터...
];

// 실시간 차트를 위한 시간별 데이터
const hourlyData = [
  { time: '09:00', congestion: 45, visitors: 1240 },
  { time: '10:00', congestion: 58, visitors: 2350 },
  { time: '11:00', congestion: 65, visitors: 3120 },
  { time: '12:00', congestion: 78, visitors: 3950 },
  { time: '13:00', congestion: 82, visitors: 4200 },
  { time: '14:00', congestion: 75, visitors: 3800 },
  { time: '15:00', congestion: 68, visitors: 3500 },
  { time: '16:00', congestion: 72, visitors: 3650 },
  { time: '17:00', congestion: 80, visitors: 4100 },
  { time: '18:00', congestion: 70, visitors: 3600 },
  { time: '19:00', congestion: 62, visitors: 3100 },
  { time: '20:00', congestion: 55, visitors: 2800 },
];

// 사용자 댓글 샘플 데이터
const commentSamples: UserComment[] = [
  {
    userName: '관광객123',
    spotName: '경복궁',
    content: '오늘 경복궁 방문했는데 생각보다 사람이 많았어요. 오후 2시쯤 방문했는데 약 30분 정도 기다려야 했습니다. 그래도 날씨가 좋아서 즐겁게 관람했어요!',
    timestamp: '방금 전',
    likes: 12,
    imageSrc: 'https://images.unsplash.com/photo-1585188973757-947d351dfe82?q=80&w=2070&auto=format&fit=crop'
  },
  {
    userName: '서울탐험가',
    spotName: '남산타워',
    content: '남산타워 케이블카는 약간 혼잡했지만, 타워 안은 생각보다 여유로웠어요. 전망대에서 서울 시내를 한눈에 볼 수 있어서 좋았습니다.',
    timestamp: '10분 전',
    likes: 8,
    imageSrc: null
  },
  {
    userName: '해변사랑',
    spotName: '해운대 해수욕장',
    content: '휴가철이라 사람이 정말 많네요. 특히 해수욕장 중앙 부분은 거의 앉을 자리가 없을 정도였어요. 조금 일찍 오시거나 양 끝쪽으로 자리를 잡는 것을 추천합니다!',
    timestamp: '35분 전',
    likes: 24,
    imageSrc: 'https://images.unsplash.com/photo-1504113925151-c78a37824263?q=80&w=2097&auto=format&fit=crop'
  }
];

const userComments = ref(commentSamples);

// 관광지 데이터 로드
onMounted(() => {
  // API 호출 대신 샘플 데이터 사용
  touristSpots.value = sampleData;
});

// 카테고리 목록
const categories = computed(() => {
  const uniqueCategories = new Set(touristSpots.value.map(spot => spot.biz_cat_name));
  return ['전체', ...Array.from(uniqueCategories)];
});

// 실시간 차트 데이터
const realTimeChartData = computed(() => {
  // 선택된 카테고리에 따라 데이터를 다르게 생성할 수 있음
  if (selectedChartCategory.value !== '전체') {
    // 선택된 카테고리에 맞는 데이터 필터링
    return hourlyData.map(item => ({
      ...item,
      // 카테고리에 따라 약간 다른 값을 생성
      congestion: Math.min(100, item.congestion + (Math.random() * 10 - 5)),
      visitors: Math.max(0, item.visitors + (Math.random() * 200 - 100))
    }));
  }
  return hourlyData;
});

// 인기 있는 관광지 TOP 10
const popularSpots = computed(() => {
  return [...touristSpots.value]
      .sort((a, b) => b.congestion - a.congestion)
      .slice(0, 10);
});

// 여유로운 관광지 TOP 10
const relaxedSpots = computed(() => {
  return [...touristSpots.value]
      .sort((a, b) => a.congestion - b.congestion)
      .slice(0, 10);
});

// 혼잡도 등급 함수
const getCrowdLevel = (level: number): CrowdLevel => {
  switch(level) {
    case 1: return { level: '여유', color: '#4CAF50' };
    case 2: return { level: '보통', color: '#2196F3' };
    case 3: return { level: '혼잡', color: '#FF9800' };
    case 4: return { level: '매우 혼잡', color: '#F44336' };
    default: return { level: '정보없음', color: '#9E9E9E' };
  }
};

// 관광지 상세 페이지로 이동
const goToSpotDetail = (poiId: string) => {
  router.push(`/spots/${poiId}`);
};

// 요약 통계
const summaryStats = computed(() => [
  {
    title: '실시간 방문자',
    value: touristSpots.value.reduce((sum, spot) => sum + spot.visitor_count, 0).toLocaleString(),
    description: '오늘 총 방문자 수',
    icon: 'Users',
    color: '#3b82f6'
  },
  {
    title: '평균 혼잡도',
    value: Math.round(touristSpots.value.reduce((sum, spot) => sum + spot.congestion, 0) / touristSpots.value.length),
    unit: '%',
    description: '전체 관광지 기준',
    icon: 'Activity',
    color: '#f97316'
  },
  {
    title: '혼잡 관광지 수',
    value: touristSpots.value.filter(spot => spot.congestion_level >= 3).length,
    description: '혼잡 또는 매우 혼잡 상태',
    icon: 'AlertCircle',
    color: '#ef4444'
  },
  {
    title: '가장 인기 있는 지역',
    value: '서울',
    description: '방문자 수 기준',
    icon: 'MapPin',
    color: '#10b981'
  }
]);
</script>