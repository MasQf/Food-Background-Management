import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: { key: data.key }, // 将 key 作为查询参数传递
    data: { username: data.username, password: data.password, captcha: data.captcha } // 其他数据作为请求体
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
