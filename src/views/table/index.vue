<script>
import * as echarts from 'echarts'
import { getCategoryCount } from '@/api/food'
import { getAllCategorys, addCategory } from '@/api/category'

export default {
  data() {
    return {
      newCategory: { name: '', sort: '' },
      oldCategory: { id: '', name: '', sort: '' },
      dialogVisible: false,
      categorys: [],
      categoryCounts: []
    }
  },
  created() {
    this.fetchAllCategory()
    this.fetchCategoryCounts()
  },
  methods: {
    fetchAllCategory() {
      getAllCategorys().then(response => {
        this.categorys = response.data.categorys
        this.renderChart()
      })
    },
    fetchCategoryCounts() {
      getCategoryCount().then(response => {
        this.categoryCounts = response.data.categoryCounts
        this.renderChart()
      })
    },
    addCategory(newCategory) {
      this.dialogVisible = false
      addCategory(newCategory).then(() => {
        this.newCategory = { name: '', sort: '' }
        this.fetchAllCategory()
      })
    },
    handleEdit(index, row) {
      console.log(row)
    },
    handleClose(done) {
      this.dialogVisible = false
      done()
    },

    cellStyle() {
      return {
        'font-size': '15px',
        height: '40px',
        padding: '0'
      }
    },
    renderChart() {
      const chartDom = document.getElementById('categoryChart')
      const myChart = echarts.init(chartDom)

      const option = {
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
              name: item.name
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

<template>
  <div class="content">
    <div class="chartContainer">
      <div class="title">Category & Quantity</div>
      <div id="categoryChart" />
    </div>
    <!-- 分类列表 -->
    <div class="editContainer">
      <div class="addCategory">
        <button class="addButton" @click="dialogVisible = true">+</button>
      </div>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          {{ newCategory }}
          <el-input v-model="newCategory.name" placeholder="name" />
          <el-input v-model="newCategory.sort" placeholder="sort" />
          <button @click="addCategory(newCategory)">OK</button>
        </span>
      </el-dialog>

      <el-table
        :data="categorys"
        stripe
        style="width: 100%"
        height="550"
        :row-style="{height: '70px'}"
        :cell-style="cellStyle"
      >
        <el-table-column
          prop="id"
          label="id"
          width="100"
        />
        <el-table-column
          prop="name"
          label="name"
          width="180"
        />
        <el-table-column
          prop="sort"
          label="sort"
        />
        <el-table-column label="Control">
          <template slot-scope="scope">
            <button
              class="editButton"
              @click="handleEdit(scope.$index, scope.row)"
            >Edit</button>
            <button
              class="deleteButton"
              @click="handleDelete(scope.$index, scope.row)"
            >Del</button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.content{
  display: flex;
}
#categoryChart {
  width: 600px;
  height: 600px;
}
.title{
  font-size: 30px;
  font-weight: 800;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  margin-bottom: 10px;
}
.chartContainer{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 1px rgba(0, 0, 0, 0.205) solid;
  margin: 20px;
  margin-left: 100px;
}
.editContainer{
  margin: 20px;
}

.addCategory{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin: 20px;
}

.addButton{
  width: 100px;
  height: 50px;
  font-size: 30px;
}

button{
  background: #fff1d5;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  font-weight: 800;
  transition: 0.2s;
  box-shadow: 0 0.2em #ffc07c;
  text-shadow: 1px 1px #ffaa50;
  margin-left: 10px;
}

button:hover {
  color: #ffffff;
  background: #ffca92;
  }

button:active {
  transform: translateY(0.1em);
  box-shadow: 0 0.1em #bf690d;
}

/* .editButton{
  border-radius: 50%;
  border: none;
  width: 20px;
  height: 20px;
  background-color: rgb(7, 169, 7);
  box-shadow: 0 0.5px rgb(0, 0, 0);
} */
</style>
