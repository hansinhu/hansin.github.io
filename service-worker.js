importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.setConfig({ debug: false })

workbox.googleAnalytics.initialize()

workbox.precaching.precacheAndRoute(
  self.__precacheManifest || [], {
    ignoreUrlParametersMatching: [/./],
    cleanUrls: false,
  }
)

// cache google analytics js
workbox.routing.registerRoute(
  new RegExp('^https://www.google-analytics.com/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'google-analytics',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 10,
      }),
    ],
  })
)

// cache facebook pixel js
workbox.routing.registerRoute(
  new RegExp('^https://connect.facebook.net/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'facebook-pixel',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 10,
      }),
    ],
  })
)

// cache static image
// cache country flag image
workbox.routing.registerRoute(
  new RegExp('/static/img/flags/'),
  new workbox.strategies.CacheFirst({
    // Use a custom cache name
    cacheName: 'flags-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        // Cache only 30 images
        maxEntries: 30,
      }),
    ],
  })
)

// 跨域的请求一般要用networkFirst，staleWhileRevalidate，下面这种强制缓存不推荐
workbox.routing.registerRoute(
  new RegExp('^https://d3kpm7yklociqe.cloudfront.net/nsr/static/img/display_category/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'categories-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        // Cache only 120 images
        maxEntries: 120,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ]
  }),
)

// 商品图片缓存
workbox.routing.registerRoute(
  new RegExp('^https://d1vs5fqeka2glf.cloudfront.net/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'product-images-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 300,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ]
  }),

)

workbox.routing.registerRoute(
  new RegExp('^https://m.cfcdn.club/static/img/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'static-images',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ]
  })
)

workbox.routing.registerRoute(
  new RegExp('^https://storage.googleapis.com/workbox-cdn/releases/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'workbox-cdn',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 10
      })
    ]
  })
)

workbox.routing.registerRoute(
  new RegExp('^https://m.cfcdn.club/static/icons'),
  new workbox.strategies.CacheFirst({
    cacheName: 'icons-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 100
      })
    ],
  })
)


workbox.routing.registerRoute(
  new RegExp('/static/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'server-static',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 100
      })
    ]
  })
)

const routerName = ["home","product","payment","account","service","orders","order","categories","cart","size","search","reviews","cod","trackinginfo","forgot","resetpassword"];
workbox.routing.registerRoute(
  new RegExp('/('+routerName.join("|")+')(?!(.html|.html?.*))'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'url-cache',
  })
)

// m站图片资源，优先使用缓存
workbox.routing.registerRoute(
  new RegExp('^https://img1.cfcdn.club/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cdn',
  }),
)

// m站代码, 优先使用缓存
workbox.routing.registerRoute(
  new RegExp('/nsr/static/dist/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'code-cdn',
  }),
)

// 网关接口
workbox.routing.registerRoute(
  /^(\/gw\/|\/cf-|\/api\/)/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'gateway-cache',
    networkTimeoutSeconds: 1.5,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
)

// 页面策略
// NB: 因为要优先使用最新数据，所以策略位: NetworkFirst, 缓存0, 200的状态
const pages = ['/product/.*']
workbox.routing.registerRoute(
  new RegExp('^(http|https)://[^/]+(' + pages.join('|') + ')'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'page-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  }),
)

// 开发使用路径
// NB: 这里配置的资源是开发的时候使用的资源
// 比如m站的话，js打包到/msite.js里面，浏览器需要获取这个资源
const developResource = ['msite.js']
workbox.routing.registerRoute(
  new RegExp('/(' + developResource.join('|') + ')'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'dev-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
)
