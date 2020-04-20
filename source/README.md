
# 1. React/JSX 编码规范
http://wiki.yuceyi.com/pages/viewpage.action?pageId=27210073

# 2. 项目目录规范
    ├── source
    │   ├── constants           // 字典配置
    │   ├── img
    │   ├── init
    │   ├── locales             // 多语言
    │   ├── pages
    │   │   ├── components       // 公用组件
    │   │   ├── product_list     // 页面app
    │   │   │   ├── components   // 页面组件
    │   │   │   ├── store        // 页面store
    │   ├── setup
    │   ├── stores               // 通用store
    │   ├── styles               // 通用样式

# 3. 公共组件说明
公共组件统一在 ``@/pages/components/index.js`` 暴露出来。组件引用：``import { XX } from '@/pages/components'``
公共组件文档：http://wiki.yuceyi.com/pages/viewpage.action?pageId=27213355

# 4. 各页面路由
  ## 4.1 订单

  * 订单列表： /orders#/?orderType=All
  [All, Unpaid, Preparing, Shipped Delivered, Refund]``
  
  * 订单详情： /orders#/[orderName]
  * 订单退款退货列表：/orders#/[orderName]/return_refund
  * 退货详情页: /order_return#/status/[returnId]
  * 退款详情页：/refund/[orderName]/[refundId]
  * 订单评论页: /order/[orderName]/reviews
