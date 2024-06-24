<script>
import { addFood, updateFood, deleteFood, getLimitFoods } from '@/api/food'
import { getAllCategorys } from '@/api/category'
import './iconfont'

export default {
  data() {
    return {
      newFood: { category_id: '', name: '', price: '', image_url: '', status: '' },
      oldFood: { category_id: '', name: '', price: '', image_url: '', status: '' },
      rules: {
        category_id: [
          { required: true, message: '?', trigger: 'change' }
        ],
        name: [
          { required: true, message: '?', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '?', trigger: 'blur' }
        ],
        image_url: [
          { required: true, message: '?', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '?', trigger: 'change' }
        ]
      },
      showEditForm: false,
      foods: [],
      categorys: [],
      total: '',
      pageNum: 1,
      pageSize: 10,
      category_id: '',
      status: '',
      params: '',
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  created() {
    // 页面加载时获取食品和分类
    this.fetchLimitFoods()
    this.fetchAllCategory()
  },
  computed: {
    statusLabel() {
      return this.oldFood.status === 1 ? '发布' : '草稿';
    }
  },
  methods: {
    addFood(newFood) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addFood(newFood).then(() => {
            this.addDialogVisible = false
            this.newFood = { name: '', price: '', image_url: '' } // Reset the form
            this.pageNum = Math.ceil(this.total / this.pageSize)
            this.fetchLimitFoods()
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
    editFood(food) {
      this.oldFood = { ...food }
      this.editDialogVisible = true
    },
    updateFood(oldFood) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateFood(oldFood).then(() => {
            this.editDialogVisible = false
            this.oldFood = { name: '', price: '', image_url: '' } // Reset the form
            this.fetchLimitFoods()
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
    deleteFood(foodId) {
      this.$confirm('将会删除该物品', 'WARNING', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        deleteFood(foodId).then(() => {
          this.fetchLimitFoods()
        })
        this.$notify.info({
          message: '已删除'
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    fetchLimitFoods(params) {
      params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        category_id: this.category_id ? this.category_id : null,
        status: this.status ? this.status : null
      }
      getLimitFoods(params).then((response) => {
        this.foods = response.data.pageBean.items
        this.total = response.data.pageBean.total
      })
    },
    fetchAllCategory() {
      getAllCategorys().then(response => {
        this.categorys = response.data.categorys
        this.renderChart()
      })
    },
    getImageUrl(imageUrl) {
      console.log(`../../assets/food_images/${imageUrl}`)
      return `${process.env.BASE_URL}src/assets/food_images/${imageUrl}`
    },
    addFoodDialog() {
      this.addDialogVisible = true
    },
    // 换页
    handleCurrentChange() {
      this.fetchLimitFoods()
    },
    // 查询
    onSubmit() {
      this.pageNum = 1
      this.fetchLimitFoods()
    },
    // 重置
    onReset() {
      this.category_id = ''
      this.status = ''
      this.fetchLimitFoods()
    },
    validatePrice(value) {
      // 仅允许输入数字和一个小数点
      const validNumber = /^[0-9]*\.?[0-9]*$/;
      if (!validNumber.test(value.target.value)) {
        // 如果输入不合法，则删除最后一个字符
        value.target.value = value.target.value.slice(0, -1);
        this.oldFood.price = value.target.value;
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <!-- 添加food对话框 -->
    <el-dialog
      class="addDialog"
      :visible.sync="addDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <el-form ref="addForm" :model="newFood" :rules="rules">
          <el-form-item label="分类ID" prop="category_id" class="custom-form-item">
            <el-select v-model="newFood.category_id" placeholder="Select">
              <el-option v-for="c in categorys" :key="c.id" :label="`${c.id} ${c.name}`" :value="c.id" />
            </el-select>
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="名称" prop="name" class="custom-form-item">
            <el-input v-model="newFood.name" />
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="价格" prop="price" class="custom-form-item">
            <el-input v-model="newFood.price" type="number" @input="validatePrice"/>
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="图片URL" prop="image_url" class="custom-form-item">
            <el-input v-model="newFood.image_url" />
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="状态" prop="status" style="margin-bottom: 20px;" class="custom-form-item">
            <el-select v-model="newFood.status" placeholder="Select">
              <el-option label="1 发布" value="1" />
              <el-option label="0 草稿" value="0" />
            </el-select>
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <button class="finishButton" @click="addFood(newFood)"></button>
        </el-form>
      </span>
    </el-dialog>

    <!-- 编辑更新food对话框 -->
    <el-dialog
      class="editDialog"
      :visible.sync="editDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <el-form ref="editForm" :model="oldFood" :rules="rules">
          <el-form-item label="分类ID" prop="category_id" class="custom-form-item">
            <el-select v-model="oldFood.category_id" placeholder="Select">
              <el-option v-for="c in categorys" :key="c.id" :label="`${c.id} ${c.name}`" :value="c.id" />
            </el-select>
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="名称" prop="name" class="custom-form-item">
            <el-input v-model="oldFood.name" />
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="价格" prop="price" class="custom-form-item">
            <el-input v-model="oldFood.price" type="number" @input="validatePrice"/>
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="图片URL" prop="image_url" class="custom-form-item">
            <el-input v-model="oldFood.image_url" />
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <el-form-item label="状态" prop="status" class="custom-form-item">
            <el-select v-model="oldFood.status" placeholder="Select">
              <el-option label="1 发布" value="1" />
              <el-option label="0 草稿" value="0" />
            </el-select>
            <template #error="{ error }">
              <span class="custom-error">{{ error }}</span>
            </template>
          </el-form-item>
          <button class="finishButton" @click="updateFood(oldFood)"></button>
        </el-form>
      </span>
    </el-dialog>

    <el-card class="box-card">

      <!-- 分类状态条件查询以及 添加food按钮 -->
      <el-form :inline="true">
        <el-form-item label="分类">
          <el-select v-model="category_id" clearable placeholder="Select">
            <el-option v-for="c in categorys" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="status" clearable placeholder="Select">
            <el-option label="发布" value="1" />
            <el-option label="草稿" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item class="buttonList">
          <button class="checkButton" @click="onSubmit">
            筛选
          </button>
          <button class="resetButton" @click="onReset">
            重置
          </button>
          <button class="addButton" @click="addFoodDialog">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tubiaozhizuomoban"></use>
            </svg>
          </button>
        </el-form-item>
      </el-form>

      <!-- 下部分food列表以及编辑和删除按钮 -->
      <el-table
        :data="foods"
        stripe
        style="width: 100%"
        height="550"
      >
        <el-table-column
          prop="id"
          label="食物ID"
          width="70"
        />
        <el-table-column
          prop="category_id"
          label="分类ID"
          width="70"
        />
        <el-table-column
          prop="name"
          label="名称"
        />
        <el-table-column
          prop="price"
          label="价格"
          width="90"
        />
        <el-table-column
          prop="image_url"
          label="图片URL"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="70"
        />
        <el-table-column
          prop="create_time"
          label="创建时间"
        />
        <el-table-column
          prop="update_time"
          label="更新时间"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <button class="editButton" @click="editFood(scope.row)"></button>
            <button class="deleteButton" @click="deleteFood(scope.row.id)"></button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页条 -->
      <el-pagination
        :current-page.sync="pageNum"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="total"
        background
        style="margin-top: 20px;justify-content: flex-end;"
        @current-change="handleCurrentChange"
      />

    </el-card>
  </div>
</template>

<style scoped>
  .container{
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }
  .editDialog{
    top: -80px;
  }
  .addDialog{
    top: -80px;
  }
  .checkButton{
    background: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 800;
    transition: 0.2s;
    box-shadow: 0 0.3em #ffffff;
    margin-right: 5px;
    width: 50px;
    height: 30px;
  }
  .checkButton:hover {
    background: #ce8704;
    color: white;
  }
  .checkButton:active {
      transform: translateY(0.1em);
      box-shadow: 0 0.2em #482603;
  }
  .resetButton{
    background: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 800;
    transition: 0.2s;
    box-shadow: 0 0.3em #ffffff;
    margin-right: 5px;
    width: 50px;
    height: 30px;
  }
  .resetButton:hover {
    background: #698af6;
    color: white;
  }
  .resetButton:active {
      transform: translateY(0.1em);
      box-shadow: 0 0.2em #090b66;
  }
  .addButton{
    margin-left: 470px;
    background: #ffffff;
    border: none;
    cursor: pointer;
    font-size: 1.3em;
    transform: translateY(8px);
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
  .deleteButton:active {
      transform: translateY(0.1em);
      box-shadow: 0 0.2em #990707;
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
  .buttonList{
    transform:translateY(-4px);
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
  ::v-deep .el-dialog .el-form-item__content{
    display: flex;
  }
  span{
    user-select: none;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
  .custom-form-item{
    margin-bottom: 0; /* 移除默认的底部间距 */
    padding-bottom: 5px; /* 添加内部间距 */
    position: relative;
  }
  ::v-deep .el-dialog .el-form-item__label{
    width: 120px;
  }
  .custom-form-item .el-select,.el-input{
    width: 80%;
  }
  .custom-error {
    color: rgb(255, 98, 98);
    font-weight: bold;
    position: absolute; /* 使用绝对定位 */
    bottom: -20px; /* 调整位置，使其显示在表单项下方 */
    right: 59px;
    white-space: nowrap;
  }

</style>
