// const path = require('path');

module.exports = {
  // 部署应用的基本URL
  publicPath: '/',
  // webpack 配置
  configureWebpack: {
    resolve: {
      alias: {
        // 'vue$': path.resolve(__dirname, 'node_modules/vue/dist/vue.js')
      }
    }
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
