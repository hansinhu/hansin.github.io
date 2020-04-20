workbox.googleAnalytics.initialize()

workbox.precaching.precacheAndRoute(
  self.__precacheManifest || [], {
    ignoreUrlParametersMatching: [/./],
    cleanUrls: false,
  }
)
