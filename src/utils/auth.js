import Cookies from 'js-cookie'

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
  if (window.Domain && window.Domain.auth_mode === 1) {
    window.location.href = `${window.Domain.api_url}/api/sys/cas/url?domain=${window.Domain.name}&redirect_uri=${encodeURIComponent(`${window.location.origin}/#${redirect}`)}&state=${encodeURIComponent(state)}`
  } else {
    if (next) {
      next(`/login?redirect=${redirect}&state=${state}`)
    } else if ($router) {
      $router.push(`/login?redirect=${redirect}&state=${state}`)
    }
  }
}

export function logoutUrl(redirect, { state = '', $router, next } = {}) {
  if (window.Domain && window.Domain.auth_mode === 1) {
    window.location.href = `${window.Domain.api_url}/api/sys/cas/logout?domain=${encodeURIComponent(window.Domain.name)}&redirect_uri=${encodeURIComponent(`${window.location.origin}/#${redirect}`)}&state=${encodeURIComponent(state)}`
  } else {
    if (next) {
      next(`/logout?redirect=${redirect}&state=${state}`)
    } else if ($router) {
      $router.push(`/logout?redirect=${redirect}&state=${state}`)
    }
  }
}
