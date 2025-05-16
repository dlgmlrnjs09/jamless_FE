<!-- src/components/layout/Sidebar.vue -->
<template>
  <div class="w-56 h-screen bg-[#151718] flex flex-col fixed left-0 top-0 z-10 border-r border-gray-800">
    <!-- 로고 영역 -->
    <div class="px-4 py-5 flex items-center border-b border-gray-800">
      <div class="flex items-center">
        <img src="@/assets/logo.svg" alt="Logo" class="w-7 h-7 mr-3" />
        <div class="flex flex-col">
          <span class="text-white font-bold text-sm">관광지 혼잡도</span>
          <span class="text-gray-400 text-xs">TOURIST VIEWERSHIP</span>
        </div>
      </div>
    </div>

    <!-- 검색 영역 -->
    <div class="px-4 py-3 border-b border-gray-800">
      <div class="relative">
        <input
            type="text"
            placeholder="스팟명, 카테고리 검색"
            class="w-full bg-[#1E2021] border border-gray-700 rounded-md py-2 pl-8 pr-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
        />
        <Search class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
      </div>
    </div>

    <!-- 메뉴 영역 -->
    <nav class="flex-grow py-4 overflow-y-auto">
      <ul class="space-y-1 px-3">
        <li v-for="(item, index) in menuItems" :key="index">
          <a
              href="#"
              :class="[
              'flex items-center px-3 py-2 rounded-md text-sm',
              item.active ? 'bg-[#232627] text-white' : 'text-gray-400 hover:bg-[#1E2021] hover:text-gray-300'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4 mr-3" />
            <span>{{ item.name }}</span>

            <span v-if="item.badge" class="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
              {{ item.badge }}
            </span>
          </a>
        </li>
      </ul>

      <div class="mt-6 px-6">
        <div class="text-xs font-medium text-gray-400 mb-2">카테고리 그룹</div>
        <ul class="space-y-1">
          <li v-for="(category, index) in categories" :key="index">
            <a
                href="#"
                :class="[
                'flex items-center px-3 py-2 rounded-md text-sm',
                category.active ? 'bg-[#232627] text-white' : 'text-gray-400 hover:bg-[#1E2021] hover:text-gray-300'
              ]"
            >
              <component :is="category.icon" class="w-4 h-4 mr-3" />
              <span>{{ category.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 하단 프로필 영역 -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
        <div class="ml-3">
          <p class="text-sm text-white font-medium">관리자</p>
          <p class="text-xs text-gray-400">로그아웃</p>
        </div>
        <Menu class="ml-auto w-5 h-5 text-gray-400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Menu, Home, MapPin, BarChart2, Database, Settings, MessageSquare, Users, Calendar, LineChart } from 'lucide-vue-next';

const menuItems = [
  { name: '소프트콘 뷰어십', icon: Home, active: false },
  { name: '대시보드', icon: BarChart2, active: false },
  { name: '스팟별 혼잡도', icon: MapPin, active: true },
  { name: '방송 현황', icon: MessageSquare, active: false, badge: 'LIVE' },
  { name: '스트리머 통계', icon: Users, active: false },
  { name: '방송 그룹', icon: Calendar, active: false },
  { name: '플랫폼', icon: Database, active: false }
];

const categories = [
  { name: '카테고리 통계', icon: LineChart, active: false },
  { name: '이스포츠', icon: Users, active: false }
];
</script>