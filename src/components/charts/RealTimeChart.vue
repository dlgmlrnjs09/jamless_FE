<!-- src/components/charts/RealTimeChart.vue -->
<template>
  <div class="relative h-full w-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { PropType } from "vue";
import { Chart, registerables } from 'chart.js';
import type { ChartTypeRegistry, ChartOptions } from 'chart.js';

// Chart.js 모든 컴포넌트 등록
Chart.register(...registerables);

interface HourlyData {
  time: string;
  congestion: number;
  visitors: number;
}

// props 정의
const props = defineProps({
  chartData: {
    type: Array as PropType<HourlyData[]>,
    required: true
  },
  category: {
    type: String,
    default: '전체'
  }
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const filteredData = computed(() => {
  // 실제 구현에서는 카테고리에 따라 데이터를 필터링할 수 있음
  return props.chartData;
});

const createChart = () => {
  if (!chartCanvas.value) return;

  // 이전 차트 인스턴스가 있다면 폐기
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  const data = {
    labels: filteredData.value.map(item => item.time),
    datasets: [
      {
        label: '혼잡도 (%)',
        data: filteredData.value.map(item => item.congestion),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      },
      {
        label: '방문자 수',
        data: filteredData.value.map(item => item.visitors),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        yAxisID: 'y2'
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          }
        },
        title: {
          display: true,
          text: '혼잡도 (%)',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          }
        },
        title: {
          display: true,
          text: '방문자 수',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 25, 40, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        boxPadding: 4
      }
    }
  };

  chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
};

onMounted(() => {
  createChart();
});

// props.chartData나 props.category가 변경될 때 차트 업데이트
watch([() => props.chartData, () => props.category], () => {
  createChart();
}, { deep: true });
</script>