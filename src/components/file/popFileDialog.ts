export function popFileDialog(): Promise<File | undefined> {
  return new Promise((resolve) => {
    // Opening file dialog
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.5emm.json'
    input.onchange = async (event: Event) => {
      // Returning if no target
      if (!event.target) {
        return
      }
      // Getting selected file
      resolve((event.target as HTMLInputElement).files?.[0])
    }
    input.click()
  })
}
