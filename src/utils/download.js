const axios = require('@/utils/request').default

export default async function download({ file_name, file_path }) {
  const res = await axios({
    url: file_path,
    method: 'get',
    responseType: 'blob'
  })
  const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
  const a = window.document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  const disposition = res.headers['content-disposition']
  const filename = file_name || window.decodeURIComponent(new RegExp('filename=(.*)').exec(disposition)[1])
  a.href = href
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(href)
}
