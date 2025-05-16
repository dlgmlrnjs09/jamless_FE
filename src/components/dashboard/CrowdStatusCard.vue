<!-- src/components/dashboard/CrowdStatusCard.vue -->
<template>
  <div
      class="relative bg-gradient-to-br from-[#232627] to-[#1A1D1F] rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      @click="$emit('select', spot.poi_id)"
  >
    <!-- 카드 헤더 (번호, 아이콘) -->
    <div class="absolute top-0 left-0 w-full h-1" :style="{ backgroundColor: crowdLevelInfo.color }"></div>

    <div class="p-5">
      <div class="flex justify-between">
        <!-- 왼쪽: 순번과 정보 -->
        <div>
          <div class="flex items-center">
            <!-- 카테고리 아이콘 -->
            <div class="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <MapPin class="w-4 h-4 text-blue-400" />
            </div>
            <h3 class="font-bold text-white text-base">{{ spot.poi_name }}</h3>
          </div>
          <div class="mt-3 flex items-center text-gray-400 text-xs">
            <span>{{ spot.biz_cat_name }}</span>
            <div class="w-1 h-1 bg-gray-600 rounded-full mx-2"></div>
            <span>{{ region }}</span>
          </div>
        </div>

        <!-- 오른쪽: 혼잡도 상태 배지 -->
        <div
            class="flex items-center px-2 py-1 rounded-full text-xs"
            :style="{ backgroundColor: `${crowdLevelInfo.color}25` }"
            :class="{
            'text-green-400': crowdLevelInfo.level === '여유',
            'text-blue-400': crowdLevelInfo.level === '보통',
            'text-orange-400': crowdLevelInfo.level === '혼잡',
            'text-red-400': crowdLevelInfo.level === '매우 혼잡'
          }"
        >
          <span>{{ crowdLevelInfo.level }}</span>
        </div>
      </div>

      <!-- 방문자 수 -->
      <div class="mt-5">
        <div class="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>현재 혼잡도</span>
          <span>{{ spot.congestion }}%</span>
        </div>
        <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
              class="h-full"
              :style="{
              width: `${spot.congestion}%`,
              backgroundColor: crowdLevelInfo.color
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 카드 푸터 -->
    <div class="px-5 py-3 border-t border-gray-800 flex justify-between items-center">
      <div class="flex items-center text-gray-400 text-xs">
        <Users class="w-3.5 h-3.5 mr-1.5" />
        <span>{{ spot.visitor_count.toLocaleString() }}</span>
      </div>
      <div class="text-xs text-gray-500">
        {{ spot.address.split(' ')[0] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MapPin, Users } from 'lucide-vue-next';
import type { TouristSpot, CrowdLevel } from '@/types';

// props와 emits 정의
const props = defineProps({
  spot: {
    type: Object as () => TouristSpot,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['select']);

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
</script>