import { getAllFoods, addFood, updateFood, deleteFood } from '@/api/food'

const state = {
  foods: []
}

const mutations = {
  SET_FOODS: (state, foods) => {
    state.foods = foods
  },
  ADD_FOOD: (state, food) => {
    state.foods.push(food)
  },
  UPDATE_FOOD: (state, updatedFood) => {
    state.foods = state.foods.map(food => {
      if (food.id === updatedFood.id) {
        return updatedFood
      }
      return food
    })
  },
  DELETE_FOOD: (state, foodId) => {
    state.foods = state.foods.filter(food => food.id !== foodId)
  }
}

const actions = {
  getAllFoods({ commit }) {
    return new Promise((resolve, reject) => {
      getAllFoods().then(response => {
        const foods = response.data.foods
        commit('SET_FOODS', foods)
        console.log(foods)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  addFood({ commit }, foodData) {
    return new Promise((resolve, reject) => {
      addFood(foodData).then(response => {
        const newFood = response.data
        commit('ADD_FOOD', newFood)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateFood({ commit }, updatedFoodData) {
    return new Promise((resolve, reject) => {
      updateFood(updatedFoodData).then(response => {
        const updatedFood = response.data
        commit('UPDATE_FOOD', updatedFood)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteFood({ commit }, foodId) {
    return new Promise((resolve, reject) => {
      deleteFood(foodId).then(() => {
        commit('DELETE_FOOD', foodId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
