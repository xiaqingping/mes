var webpack = require('webpack'); // 引入webpack库
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // 部署应用的基本URL
  publicPath: '/',
  // webpack 配置
  configureWebpack: config => {
    let meConfig = {
      resolve: {
        alias: {
          'vue$': path.resolve(__dirname, 'node_modules/vue/dist/vue.js')
        }
      }
    };

    if (process.env.NODE_ENV === 'production') {
      // 生产
      meConfig = Object.assign(meConfig, {
        optimization: {
          splitChunks: {
            maxSize: 1000000
          }
        }
      });
    } else {
      // 开发
    }

    return meConfig;
  },
  chainWebpack: config => {
    config.plugin('ignore')
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)); // 忽略/moment/locale下的所有文件
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
