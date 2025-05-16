<!-- src/components/charts/CrowdHistoryChart.vue -->
<template>
  <div>
    <h3 class="text-lg font-medium mb-2">{{ title }}</h3>
    <div class="h-64">
      <line-chart
          :chart-data="chartData"
          :chart-options="chartOptions"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import {LineChart} from "lucide-vue-next";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { ChartData } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default defineComponent({
  name: 'CrowdHistoryChart',
  components: {
    LineChart
  },
  props: {
    pastData: {
      type: Array as () => ChartData[],
      required: true
    },
    dark: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    forecast: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const chartData = computed(() => {
      const dataKey = props.forecast ? '예상혼잡도' : '혼잡도';

      return {
        labels: props.pastData.map(item => item.day),
        datasets: [
          {
            label: dataKey,
            data: props.pastData.map(item => item[dataKey]),
            borderColor: props.forecast ? '#FF9800' : '#2196F3',
            backgroundColor: props.forecast ? 'rgba(255, 152, 0, 0.2)' : 'rgba(33, 150, 243, 0.2)',
            tension: 0.4,
            fill: true
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
              color: props.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: props.dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }
          },
          x: {
            grid: {
              color: props.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: props.dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: props.dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }
          },
          tooltip: {
            backgroundColor: props.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: props.dark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
            bodyColor: props.dark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
            borderColor: props.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1
          }
        }
      };
    });

    return {
      chartData,
      chartOptions
    };
  }
});
</script>