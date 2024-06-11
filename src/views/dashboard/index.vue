<script>
import { getAllFoods, addFood, updateFood, deleteFood } from '@/api/food'

export default {
  data() {
    return {
      // category_id, name, price, image_url, status
      newFood: { category_id: '', name: '', price: '', image_url: '', status: '' },
      oldFood: { id: '', category_id: '', name: '', price: '', image_url: '', status: '' },
      showEditForm: false,
      foods: []
    }
  },
  created() {
    getAllFoods().then((response) => {
      this.foods = response.data.foods
    }) // 页面加载时获取食品列表
  },
  methods: {
    addFood(newFood) {
      addFood(newFood).then(() => {
        this.newFood = { name: '', price: '', image_url: '' } // Reset the form
        this.fetchFoods() // Fetch the updated list of foods
      })
    },
    editFood(food) {
      this.oldFood = { ...food }
      console.log(this.oldFood)
      this.showEditForm = true
    },
    updateFood(oldFood) {
      updateFood(oldFood).then(() => {
        this.showEditForm = false
        this.oldFood = { name: '', price: '', image_url: '' } // Reset the form
        this.fetchFoods() // Fetch the updated list of foods
      })
    },
    deleteFood(foodId) {
      deleteFood(foodId).then(() => {
        this.fetchFoods() // Fetch the updated list of foods
      })
    },
    fetchFoods() {
      getAllFoods().then((response) => {
        this.foods = response.data.foods
      })
    },
    getImageUrl(imageUrl) {
      console.log(`../../assets/food_images/${imageUrl}`)
      return `${process.env.BASE_URL}src/assets/food_images/${imageUrl}`
    }
  }
}
</script>

<template>
  <div>
    <h1>Food</h1>

    <!-- 添加食品表单 -->
    <div>
      <h2>Add Food</h2>
      <h3>{{ newFood }}</h3>
      <input v-model="newFood.category_id" type="text" placeholder="category_id">
      <input v-model="newFood.name" type="text" placeholder="name">
      <input v-model="newFood.price" type="number" placeholder="price">
      <input v-model="newFood.image_url" type="text" placeholder="image_url">
      <input v-model="newFood.status" type="number" placeholder="status">
      <button @click="addFood(newFood)">+</button>
    </div>

    <hr>

    <!-- 编辑食品表单 -->
    <div v-if="showEditForm">
      <h2>编辑食品</h2>
      <h3>{{ oldFood }}</h3>
      <input v-model="oldFood.category_id" type="text" placeholder="category_id">
      <input v-model="oldFood.name" type="text" placeholder="name">
      <input v-model="oldFood.price" type="number" placeholder="price">
      <input v-model="oldFood.image_url" type="text" placeholder="image_url">
      <input v-model="oldFood.status" type="number" placeholder="status">
      <button @click="updateFood(oldFood)">保存</button>
    </div>

    <hr>

    <!-- 食品列表 -->
    <div>
      <h2>Food List</h2>
      <div v-for="food in foods" :key="food.id" class="foodContainer">
        <img v-if="food.image_url" :src="`/assets/food_images/${food.image_url}`" style="width: 145px; height: 145px;">

        <div class="foodContent">
          <div class="foodInfo">
            <div>id: {{ food.id }}</div>
            <div>category_id: {{ food.category_id }}</div>
            <div>name: {{ food.name }}</div>
            <div>price: ￥{{ food.price }}</div>
            <div>status: {{ food.status }}</div>
            <div>create_time: {{ food.create_time }}</div>
            <div>update_time: {{ food.update_time }}</div>
          </div>
          <div class="foodBtton">
            <button @click="editFood(food)">Edit</button>
            <button @click="deleteFood(food.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <hr>
  </div>
</template>

<style scoped>
  .foodContainer{
    background-color: rgb(255, 240, 209);
    display: flex;
    padding: 15px;
    margin: 5px;
    border-radius: 20px;
    width: 50%;
  }
  .foodContent{
    padding-left: 30px;
  }
  .foodInfo{
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }
  button{
    width: 100px;
  }
  img{
    border-radius: 20px;
  }
</style>
