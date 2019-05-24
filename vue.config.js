module.exports = {
  // 部署应用的基本URL
  publicPath: '/',
  // webpack 配置
  configureWebpack: {

  },
  // webpack devServer
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    // 代理
    proxy: {
      '/oldapi': {
        target: 'https://preapi.sangon.com',
        changeOrigin: true,
        pathRewrite: {
          '^/oldapi': ''
        }
      }
    }
  }
};
