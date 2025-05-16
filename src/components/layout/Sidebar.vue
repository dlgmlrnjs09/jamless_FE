<!-- src/components/layout/Sidebar.vue -->
<template>
  <div
      :class="[
      sidebarOpen ? 'w-64' : 'w-20',
      isDarkMode ? 'bg-gray-800' : 'bg-gray-200',
      'h-screen transition-all duration-300 ease-in-out flex flex-col fixed left-0 top-0 z-10'
    ]"
  >
    <div :class="[
      'p-4 flex items-center',
      sidebarOpen ? 'justify-between' : 'justify-center',
      'border-b',
      isDarkMode ? 'border-gray-700' : 'border-gray-300'
    ]">
      <div class="flex items-center">
        <Map class="w-6 h-6 text-blue-500" />
        <span v-if="sidebarOpen" class="ml-2 text-xl font-bold">관광지 혼잡도</span>
      </div>
      <button
          @click="toggleSidebar"
          :class="[
          isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black',
          'focus:outline-none'
        ]"
      >
        <Menu class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-grow py-4">
      <ul>
        <li
            v-for="(item, index) in menuItems"
            :key="index"
            :class="[
            'mb-2 rounded-lg overflow-hidden mx-2',
            item.active
              ? isDarkMode ? 'bg-gray-700' : 'bg-white'
              : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
          ]"
        >
          <a
              href="#"
              :class="[
              'flex items-center',
              sidebarOpen ? 'pl-4 pr-6' : 'justify-center',
              'py-3'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 text-blue-500" />
            <span v-if="sidebarOpen" class="ml-3">{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <div :class="['p-4 border-t', isDarkMode ? 'border-gray-700' : 'border-gray-300']">
      <button
          @click="toggleDarkMode"
          :class="[
          'flex items-center',
          sidebarOpen ? 'w-full justify-between' : 'justify-center',
          'p-2 rounded-lg',
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
        ]"
      >
        <component :is="isDarkMode ? Sun : Moon" :class="isDarkMode ? 'text-yellow-400' : 'text-blue-600'" class="w-5 h-5" />
        <span v-if="sidebarOpen">{{ isDarkMode ? '라이트 모드' : '다크 모드' }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Map, Menu, Home, MapPin, BarChart2, Database, Settings, Sun, Moon } from 'lucide-vue-next';

export default defineComponent({
  name: 'SidebarComponent',
  components: {
    Map, Menu, Home, MapPin, BarChart2, Database, Settings, Sun, Moon
  },
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    dark: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'update:dark'],
  setup(props, { emit }) {
    const sidebarOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    });

    const isDarkMode = computed({
      get: () => props.dark,
      set: (value) => emit('update:dark', value)
    });

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
    };

    const menuItems = [
      { name: '대시보드', icon: Home, active: false },
      { name: '관광지 혼잡도', icon: MapPin, active: true },
      { name: '통계 분석', icon: BarChart2, active: false },
      { name: '데이터 관리', icon: Database, active: false },
      { name: '설정', icon: Settings, active: false }
    ];

    return {
      sidebarOpen,
      isDarkMode,
      toggleSidebar,
      toggleDarkMode,
      menuItems,
      Sun,
      Moon
    };
  }
});
</script>