// pretty simple static file i guess
export const useAppVersion = () => {
  const appVersion = {
    appVersion: process.env.PACKAGE_VERSION || '0.0.0',
    buildNumber: process.env.BUILD_NUMBER || '0',
  }

  return {
    ...appVersion,
    majorVersion: appVersion.appVersion.split('.')[0],
    minorVersion: appVersion.appVersion.split('.')[1],
    revision: appVersion.appVersion.split('.')[2],
  }
}
