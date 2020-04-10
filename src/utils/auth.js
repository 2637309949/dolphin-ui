import Cookies from 'js-cookie'
import * as cas from '@/api/cas'

const TokenKey = 'access_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function loginUrl(redirect, { state = '', $router, next } = {}) {
  if (window.Domain.auth_mode === 1) {
    cas.url(redirect, state)
  } else {
    if (next) {
      next(`/login?redirect=${redirect}&state=${state}`)
    } else if ($router) {
      $router.push(`/login?redirect=${redirect}&state=${state}`)
    }
  }
}

export function logoutUrl(redirect, { state = '', $router, next } = {}) {
  if (window.Domain.auth_mode === 1) {
    cas.logout(redirect, state)
  } else {
    if (next) {
      next(`/logout?redirect=${redirect}&state=${state}`)
    } else if ($router) {
      $router.push(`/logout?redirect=${redirect}&state=${state}`)
    }
  }
}
