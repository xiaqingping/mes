/**
 * 开发时，接口代理
 */
export default {
  '/192.168.19.71:8550/': {
    target: 'http://192.168.19.71:8550/',
    changeOrigin: true,
    pathRewrite: { '^/192.168.19.71:8550/': '' },
  },
  '/192.168.19.71:8001/': {
    target: 'http://192.168.19.71:8001/',
    changeOrigin: true,
    pathRewrite: { '^/192.168.19.71:8001/': '' },
  },
  '/192.168.20.12:8360/': {
    target: 'http://192.168.20.12:8360/',
    changeOrigin: true,
    pathRewrite: { '^/192.168.20.12:8360/': '' },
  },
  '/192.168.20.12:8460/': {
    target: 'http://192.168.20.12:8460/',
    changeOrigin: true,
    pathRewrite: { '^/192.168.20.12:8460/': '' },
  },
  '/192.168.20.6:8166/': {
    target: 'http://192.168.20.6:8166/',
    changeOrigin: true,
    pathRewrite: { '^/192.168.20.6:8166/': '' },
  },
};
