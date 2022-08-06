export function download(
  content: string,
  fileName: string,
  contentType: string
) {
  const a = document.createElement('a')
  const file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function saveJson(data: any, filename: string) {
  download(JSON.stringify(data), filename, 'application/json')
}
