import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  // error handling
  app.config.errorHandler = function (err, vm, info) {
    window.location.assign(`${window.location.href}reset`)
    window.location.reload()
  }

  window.onerror = function () {
    window.location.assign(`${window.location.href}reset`)
    window.location.reload()
  }
})
