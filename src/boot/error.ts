import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  // error handling
  app.config.errorHandler = function (err) {
    console.error(err)
    
    // don't do this in dev mode
    if (process.env.BUILD_NUMBER === 'DEV') return

    window.location.assign(`${window.location.href}reset`)
    window.location.reload()
  }

  window.onerror = function (err) {
    console.error(err)
    
    // don't do this in dev mode
    if (process.env.BUILD_NUMBER === 'DEV') return

    window.location.assign(`${window.location.href}reset`)
    window.location.reload()
  }
})
