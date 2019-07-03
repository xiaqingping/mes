const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // 部署应用的基本URL
  publicPath: '/',
  // webpack 配置
  configureWebpack: {
    // plugins: [
    //   new BundleAnalyzerPlugin()
    // ],
    resolve: {
      alias: {
        'vue$': path.resolve(__dirname, 'node_modules/vue/dist/vue.js')
      }
    }
  },
  chainWebpack: config => {
    if (process.env.use_analyzer) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
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
