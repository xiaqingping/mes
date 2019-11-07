# MES
使用 React + Umijs + Ant Design of React 构建的后台管理系统

## 使用

``` bash
# 安装依赖
npm install

# 开发
npm start

# 生产
npm run build
```

## 技术栈
[React](https://zh-hans.reactjs.org/) + [UmiJS](https://umijs.org/zh/) + [DvaJS](https://dvajs.com/)  
[Ant Design of React](https://ant.design/docs/react/introduce-cn)  

## 命名规范
* `/src/models` 全局数据文件夹下文件命名，比如我负责测序模块（seq），那么你的全局数据文件必须命名为 `seq.js`，每一个大模块为一个文件。
* `/src/api` 接口文件夹下的文件命名，根据后台接口微服务命名，一个微服务为一个文件，多个不同的服务不要放到同一个文件内。比如 `basic` 服务，就是 `basic.js`。

## 接口设置
> 开发默认接口是 `pre`。

修改默认的接口环境：在项目根目录新建 `.env` 文件，输入 `BASE_API=pre`，其中 `pre` 可以改为以下说明中的其他环境。

### 说明
接口环境现有四种，分别是：
* dev (开发)
* test (测试)
* pre (预生产)
* prod (生产)

一般只有在正式生产服务器才会使用 `prod` 环境（或者有时候需要使用生产数据debug），开发时一般用其他三种就可以。

### 开发环境

### 生产环境

## [全局数据](/docs/全局数据.md)

## 负责人
<details>
<summary>展开查看</summary>
<pre><code>
多肽合成：石雷
业务伙伴：石雷
测序管理：孟禹丞
用户权限：孟禹丞
高通量：孟禹丞 + 吴贺珍
物料项目：
RNA合成：王星名 -> 吴贺珍
人事管理：吴贺珍
采购管理：王星名 -> 张文惠
系统管理：张文慧
</code></pre>
</details>

## 项目结构
<details>
<summary>展开查看</summary>
<pre>
<code>
|—— config/ 项目配置文件
|   |—— router/ 路由文件夹
|   |   |—— **.js 各模块路由
|   |   |—— index.js 路由入口
|   |
|   |—— config.js 编译时配置文件
|
|—— public/ 静态资源文件
|
|—— src/ 源码
|   |—— api/ 接口文件
|   |   |—— *** 根据后台微服务拆分接口文件
|   |   |—— index.js 接口根模块
|   |
|   |—— assets/ 资源文件（会被webpack打包）
|   |
|   |—— components/ 全局组件
|   |
|   |—— layouts/ 布局
|   |
|   |—— locales/ i18n国际化
|   |
|   |—— models/ 全局数据
|   |
|   |—— pages/ 页面 每个项目大模块一个文件夹，模块下的页面也是一个文件夹，入口都是`index.jsx`，页面内的局部组件都放到页面文件夹的components目录下
|   |   |—— .umi/ 此目录自动生成，不要修改/删除
|   |   |—— seq/ 测序模块
|   |       |—— order/ 测序订单
|   |           |—— components/ 页面内组件
|   |           |—— index.jsx 页面入口
|   |
|   |—— utils/ 工具函数
|   |
|   |—— app.js 运行时配置文件
|   |—— global.jsx 项目入口
|   |—— global.less 全局样式
|
|—— .env 环境变量文件（不提交到远程仓库）
|
|—— .gitignore
|
|—— CHANGELOG.md 更新日志 
|
|—— jsconfig.json vscode编辑器JS项目配置
|
|—— package.json npm包文件
|
|—— README.md 项目说明
</code>
</pre>
</details>
