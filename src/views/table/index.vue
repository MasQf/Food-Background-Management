<script>
import * as echarts from 'echarts'
import './iconfont'
import { getCategoryCount } from '@/api/food'
import { getAllCategorys, addCategory, updateCategory, deleteCategory } from '@/api/category'

export default {
  data() {
    return {
      newCategory: { name: '', sort: '' },
      oldCategory: { id: '', name: '', sort: '' },
      addDialogVisible: false,
      editDialogVisible: false,
      categorys: [],
      categoryCounts: [],
      rules: {
        name: [
          { required: true, message: '?', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '?', trigger: 'blur' }
        ]
      }
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
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addDialogVisible = false
          addCategory(newCategory).then(() => {
            this.newCategory = { name: '', sort: '' }
            this.fetchAllCategory()
          })
          this.$notify({
            title: 'SUCCESS',
            message: '添加成功',
            type: 'success'
          });
        } else {
          this.$notify.error({
          title: 'ERROR',
          message: '未正确完成填写'
        });
        }
      })
    },
    handleEdit(category) {
      this.oldCategory = { ...category }
      this.editDialogVisible = true
    },
    updateCategory(oldCategory) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateCategory(oldCategory).then(() => {
            this.editDialogVisible = false
            this.oldCategory = { name: '', sort: '' }
            this.fetchAllCategory()
          })
          this.$notify({
            title: 'SUCCESS',
            message: '更新成功',
            type: 'success'
          });
        } else {
          this.$notify.error({
          title: 'ERROR',
          message: '未正确完成填写'
        });
        }
      })
    },
    handleClose(done) {
      this.addDialogVisible = false
      done()
    },
    handleDelete(categoryId) {
      this.$confirm('将会删除该分类', 'WARNING', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        deleteCategory(categoryId).then(() => {
          this.fetchAllCategory()
        })
        this.$message({
          type: 'success',
          message: 'Delete Successfully'
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
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
        <button class="addButton" @click="addDialogVisible = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tubiaozhizuomoban"></use>
          </svg>
        </button>
      </div>

      <el-dialog
        class="addDialog"
        :visible.sync="addDialogVisible"
        width="30%"
        height="200px"
        :before-close="handleClose"
      >
        <span slot="footer" class="dialog-footer">
          <el-form ref="addForm" :model="newCategory" :rules="rules">
            <el-form-item label="名称" prop="name">
              <el-input v-model="newCategory.name" />
              <template #error="{ error }">
                <span class="custom-error">{{ error }}</span>
              </template>
            </el-form-item>
            <button class="finishButton" @click="addCategory(newCategory)"></button>
          </el-form>
        </span>
      </el-dialog>

      <el-dialog
        class="editDialog"
        :visible.sync="editDialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span slot="footer" class="dialog-footer">
          <el-form ref="editForm" :model="oldCategory" :rules="rules">
            <el-form-item label="名称" prop="name">
              <el-input v-model="oldCategory.name" />
              <template #error="{ error }">
                <span class="custom-error">{{ error }}</span>
              </template>
            </el-form-item>
            <button class="finishButton" @click="updateCategory(oldCategory)"></button>
          </el-form>
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
              @click="handleEdit(scope.row)"
            ></button>
            <button
              class="deleteButton"
              @click="handleDelete(scope.row.id)"
            ></button>
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
  font-size: 30px;
  background-color: white;
  border: none;
  cursor: pointer;
}
.editButton{
    background: #16c719;
    border: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.29) 1px solid;
    cursor: pointer;
    font-size: 1em;
    font-weight: 800;
    transition: 0.2s;
    box-shadow: 0 0.3em #2f9413;
    margin-right: 5px;
  }
  .editButton:hover {
    color: rgb(72, 84, 71);
    background: #77e456;
  }
  .editButton:active {
      transform: translateY(0.1em);
      box-shadow: 0 0.2em #116406;
  }
  .deleteButton{
    background: #ff6964;
    border: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.29) 1px solid;
    cursor: pointer;
    font-size: 1em;
    font-weight: 800;
    transition: 0.2s;
    box-shadow: 0 0.3em #c65d48;
  }
  .deleteButton:hover {
    color: rgb(255, 174, 159);
    background: #ff3523;
  }
  .finishButton{
    background: #16c719;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.29) 1px solid;
    cursor: pointer;
    font-size: 1em;
    font-weight: 800;
    transition: 0.2s;
    box-shadow: 0 0.3em #2f9413;
    margin-right: 5px;
    margin-left: 5px;
  }
  .finishButton:hover {
    color: rgb(72, 84, 71);
    background: #77e456;
  }
  .finishButton:active {
      transform: translateY(0.1em);
      box-shadow: 0 0.2em #116406;
  }
  .icon {
    width: 1.8em;
    height: 1.8em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  ::v-deep .el-dialog__body{
    padding: 20px;
  }
  ::v-deep .el-dialog__header{
    padding: 0vh 0vw 0vh 0vw;
  }
      /*修改右上角按钮*/
  ::v-deep .el-dialog__headerbtn {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 0;
    /* background: 0 0; */
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 30px;
  }
  .custom-error {
    color: red;
    font-weight: bold;
    position: absolute; /* 使用绝对定位 */
    bottom: -20px; /* 调整位置，使其显示在表单项下方 */
    right: 0;
    white-space: nowrap;
  }
</style>
