<!-- src/components/charts/RegionalStatChart.vue -->
<template>
  <div class="bg-[#1A1D1F] rounded-lg p-4">
    <h3 class="text-gray-300 text-sm font-medium mb-4">지역별 평균 혼잡도</h3>
    <div class="h-64">
      <bar-chart
          :chart-data="chartData"
          :chart-options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BarChart } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { TouristSpot } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// props 정의
const props = defineProps({
  spots: {
    type: Array as () => TouristSpot[],
    required: true
  }
});

// 지역별 평균 혼잡도 계산
const regionData = computed(() => {
  const regions = [...new Set(props.spots.map(spot => spot.address.split(' ')[0]))];

  return regions.map(region => {
    const spotsInRegion = props.spots.filter(spot =>
        spot.address.includes(region)
    );
    const avgCongestion = Math.round(
        spotsInRegion.reduce((sum, spot) => sum + spot.congestion, 0) /
        spotsInRegion.length
    );
    return { region, avgCongestion };
  });
});

const chartData = computed(() => {
  return {
    labels: regionData.value.map(r => r.region),
    datasets: [
      {
        label: '평균 혼잡도',
        data: regionData.value.map(r => r.avgCongestion),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 205, 86, 0.5)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(255, 99, 132)',
          'rgb(153, 102, 255)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1
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