import request from '@/utils/request'

export function getAllFoods() {
  return request({
    url: '/food/list',
    method: 'get'
  })
}

export function addFood(foodData) {
  return request({
    url: '/food/add',
    method: 'post',
    data: foodData
  })
}

export function updateFood(updatedFoodData) {
  return request({
    url: '/food/update',
    method: 'put',
    data: updatedFoodData
  })
}

export function deleteFood(foodId) {
  return request({
    url: `/food/delete/${foodId}`,
    method: 'delete'
  })
}

export function getCategoryCount() {
  return request({
    url: '/food/categoryCount',
    method: 'get'
  })
}
