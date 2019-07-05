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

## 技术栈
[Vue](https://cn.vuejs.org/v2/guide/) + [Vue Router](https://router.vuejs.org/zh/) + [Vuex](https://vuex.vuejs.org/zh/guide/)  
[Ant-design-vue](https://vue.ant.design/docs/vue/introduce-cn/)  
[vxe-table](https://xuliangzhan_admin.gitee.io/vxe-table/)

## 环境变量设置
这里涉及到 [vue-cli](https://cli.vuejs.org/zh/guide/mode-and-env.html)，请查看文档。
示例文件：`.env.development.local`，格式 `name=value`，下面示例中的注释，不可写入此文件中。
``` 
VUE_APP_BASE_URL_TYPE=pre # 接口设置
VUE_APP_redirect=/seq/series # 重定向设置
```

## 接口设置
> 开发与部署默认接口都是 `dev`，如需设置不同的接口，请按照下面的详细说明操作。

### 说明
接口环境现有四种，分别是：
* dev (开发)
* text (测试)
* pre (预生产)
* product (生产)

一般只有在正式生产服务器才会使用 `product` 环境（或者有时候需要使用生产数据debug），开发时一般用其他三种就可以。

### 开发环境
请在根目录新建文件名为 `.env.development.local` 的文件，这个文件会被 git 忽略，所以可以每个人都设置不同的环境变量，对应不同的接口，不需要每次都在 `request.js` 文件中更改。
设置环境变量 `VUE_APP_BASE_URL_TYPE=你需要的接口环境`，这里的选项就是上面说明列出的四种接口环境（`pre、dev、test、product`）。

### 生成环境
生产时，先使用 `git clone` 本项目到服务器，然后在项目根目录新建文件名为 `.env.production.local` 的文件，这个文件也会被 git 忽略，所以如果在开发时新建了此文件，并不会上传到远程仓库，因此必须在 `git clone` 项目后新建此文件。
只需要在第一次 `git clone` 项目时新建一次，以后 `git pull` 新代码后，并不需要再次新建。如果需要更改接口环境，只需要更改此文件后，再次 `npm run build` 就可以了。

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
|   |
|   |—— assets/ 资源文件（会被webpack打包）
|   |
|   |—— components/ 组件
|   |
|   |—— config/ 配置文件
|   |
|   |—— core/ 与vue框架相关（指令、插件等）
|   |
|   |—— layouts/ 布局
|   |
|   |—— router/ 路由
|   |   |—— config/ 
|   |   |   |—— *** 每个项目大模块一个js文件
|   |   |—— index.js 路由主模块
|   |
|   |—— store/ 全局数据
|   |
|   |—— views/ 页面
|   |   |—— ***/ 每个项目大模块一个文件夹
|   |   |—— login.vue 登录页面
|   |
|   |—— APP.vue 根组件
|   |—— main.js 项目入口
|   |—— permission.js 权限控制
|
|—— .gitignore
|
|—— babel.config.js 
|
|—— CHANGELOG.md 更新日志 
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