<template>
  <div>
    <h1>Category Statistics</h1>
    <div id="categoryChart" style="width: 600px; height: 400px;" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getCategoryCount } from '@/api/category'

export default {
  data() {
    return {
      categoryCounts: []
    }
  },
  mounted() {
    this.fetchCategoryCounts()
  },
  methods: {
    fetchCategoryCounts() {
      getCategoryCount().then(response => {
        this.categoryCounts = response.data.categoryCounts
        this.renderChart()
      })
    },
    renderChart() {
      const chartDom = document.getElementById('categoryChart')
      const myChart = echarts.init(chartDom)

      const option = {
        title: {
          text: 'Category Count',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Category',
            type: 'pie',
            radius: '50%',
            data: this.categoryCounts.map(item => ({
              value: item.count,
              name: 'Category ' + item.id
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      option && myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
#categoryChart {
  width: 100%;
  height: 500px;
}
</style>
