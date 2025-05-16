<!-- src/components/layout/Header.vue -->
<template>
  <header :class="[
    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    'border-b px-6 py-4 sticky top-0 z-10'
  ]">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold">관광지 혼잡도 분석 시스템</h1>
        <div :class="[
          isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700',
          'px-3 py-1 rounded-full text-xs font-medium'
        ]">
          실시간 데이터
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search
              :class="[
              'absolute left-3 top-1/2 transform -translate-y-1/2',
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            ]"
              :size="18"
          />
          <input
              type="text"
              placeholder="관광지 검색..."
              :class="[
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500'
                : 'bg-gray-100 border-gray-300 text-gray-700 focus:border-blue-500',
              'border rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none'
            ]"
          />
        </div>
        <div :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
          <button class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span>관리자</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Search } from 'lucide-vue-next';

export default defineComponent({
  name: 'HeaderComponent',
  components: {
    Search
  },
  props: {
    dark: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    return {
      isDarkMode: props.dark
    };
  }
});
</script>