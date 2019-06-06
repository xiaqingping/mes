# MES
使用 Vue.js + Ant Design vue 构建的后台管理系统

## 使用

``` bash
# 安装开发依赖
npm install

# 热重载开发服务器
npm run serve

# 生产
npm run build

# 运行测试
npm run test

# Lints and fixes files
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 负责人
<details>
<summary>展开查看</summary>
<pre><code>
多肽合成：石雷
RNA合成：王星名
测序管理：孟禹丞
采购管理：王星名
人事管理：吴贺珍
系统管理：张文慧
</code></pre>
</details>

## 项目结构
<details>
<summary>展开查看</summary>
<pre>
<code>
|—— public/ 静态资源文件
|
|—— src/ 源码
|   |—— api/ 接口文件
|   |   |—— *** 根据后台微服务拆分接口文件
|   |   |—— index.js 接口根模块
|   |—— assets/ 资源文件（会被webpack打包）
|   |—— components/ 组件
|   |—— config/ 配置文件
|   |—— core/ 与vue框架相关（指令、插件）
|   |—— layouts/ 布局
|   |—— router/ 路由
|   |   |—— config/ 
|   |   |   |—— *** 每个项目大模块一个js文件
|   |   |—— index.js 路由主模块
|   |—— store/ 全局数据
|   |—— views/ 页面
|   |   |—— ***/ 每个项目大模块一个文件夹
|   |   |—— login.vue 登录页面
|   |—— APP.vue 根组件
|   |—— main.js 项目入口
|   |—— permission.js 权限控制
|
|—— .gitignore
|
|—— babel.config.js 
|
|—— jsconfig.json vscode编辑器JS项目配置
|
|—— package.json npm包文件
|
|—— README.md 项目说明
|
|—— vue.config.js vue项目配置文件
</code>
</pre>
</details>