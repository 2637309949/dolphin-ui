
export function url(redirect, state) {
  window.open(`${window.Domain.api_url}/api/sys/cas/url?redirect_uri=${encodeURIComponent(`${window.location.origin}/#${redirect}`)}&state=${state}`, true)
}

export function logout(redirect, state) {
  window.open(`${window.Domain.api_url}/api/sys/cas/logout?redirect_uri=${encodeURIComponent(`${window.location.origin}/#${redirect}`)}&state=${state}`, true)
}
