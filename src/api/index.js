import request from '@/utils/request'

export function fetchList (params) {
  return request({
    url: '/api/common/articles',
    method: 'get',
    params: params
  })
}

export function fetchFocus () {
  return request({
    url: '/api/common/focus/list',
    method: 'get',
    params: {}
  })
}

export function fetchCategory () {
  return request({
    url: '/api/common/category',
    method: 'get',
    params: {}
  })
}

export function fetchFriend () {
  return request({
    url: '/api/common/friend',
    method: 'get',
    params: {}
  })
}

export function fetchSocial () {
  return request({
    url: '/api/common/social',
    method: 'get',
    params: {}
  })
}
export function fetchArticle (id) {
  return request({
    url: '/api/common/article/' + id,
    method: 'get'
  })
}
export function fetchSiteInfo () {
  return request({
    url: '/api/common/site',
    method: 'get',
    params: {}
  })
}

export function sendEmail (params) {
  return request({
    url: '/api/common/sendEmail',
    method: 'post',
    data: params
  })
}

export function fetchComment (articleId) {
  return request({
    url: '/api/common/comment/' + articleId,
    method: 'get'
  })
}
export function insertComment (params) {
  return request({
    url: '/api/comment/insertComment',
    method: 'post',
    data: params
  })
}

export function search (params) {
  return request({
    url: '/api/common/search',
    method: 'get',
    params
  })
}
export function userInfo (token) {
  return request({
    url: '/api/commonAdmin/userInfo/' + token,
    method: 'get'
  })
}
export function logout () {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}

export function login (params) {
  return request({
    url: '/api/login',
    method: 'post',
    data: params
  })
}
