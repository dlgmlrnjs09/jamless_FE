<!-- src/components/charts/CrowdHistoryChart.vue -->
<template>
  <div class="relative">
    <line-chart
        :chart-data="chartData"
        :chart-options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LineChart } from "lucide-vue-next";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { ChartData } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// props 정의
const props = defineProps({
  pastData: {
    type: Array as () => ChartData[],
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  forecast: {
    type: Boolean,
    default: false
  }
});

const chartData = computed(() => {
  const dataKey = props.forecast ? '예상혼잡도' : '혼잡도';

  return {
    labels: props.pastData.map(item => item.day),
    datasets: [
      {
        label: dataKey,
        data: props.pastData.map(item => item[dataKey]),
        borderColor: props.forecast ? '#FF9800' : '#2196F3',
        backgroundColor: props.forecast ? 'rgba(255, 152, 0, 0.1)' : 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: props.forecast ? '#FF9800' : '#2196F3',
        pointBorderColor: '#000'
      }
    ]
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        displayColors: false
      }
    }
  };
});
</script>