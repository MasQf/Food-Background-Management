import request from '@/utils/request'

export function getAllCategorys() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

export function addCategory(categoryData) {
  return request({
    url: '/category/add',
    method: 'post',
    data: categoryData
  })
}

export function updateCategory(updatedcategoryData) {
  return request({
    url: '/category/update',
    method: 'put',
    data: updatedcategoryData
  })
}

export function deleteCategory(categoryId) {
  return request({
    url: `/category/delete/${categoryId}`,
    method: 'delete'
  })
}
