
export default async function download(fetch) {
  const res = await fetch
  const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
  const a = window.document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  const disposition = res.headers['content-disposition']
  console.log(window.decodeURIComponent(new RegExp('filename="(.*)"').exec(disposition)))
  const filename = window.decodeURIComponent(new RegExp('filename=(.*)').exec(disposition)[1])
  a.href = href
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(href)
}
