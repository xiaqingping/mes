# MES

使用 React + Umijs + Ant Design of React 构建的后台管理系统

## 1. 使用

推荐使用 [yarn](https://yarn.bootcss.com/) 管理项目依赖。

```bash
# 使用 yarn 安装依赖
yarn install

# 开发
yarn start

# 生产
yarn run build
```

## 2. 技术栈

[React](https://zh-hans.reactjs.org/) + [UmiJS](https://umijs.org/zh/) + [DvaJS](https://dvajs.com/)  
[Antd](https://ant.design/docs/react/introduce-cn) + [i18n](https://github.com/formatjs/react-intl)

## 3. 如何开始一个新项目

开始工作前要明白三个概念：系统、项目和页面。

- 系统：系统由多个项目构成。比如魔方系统，也是唯一的系统，它由测序管理、多肽合成、业务伙伴等多个项目构成
- 项目：项目由多个页面构成。比如测序管理，它由取样单、测序订单、样品制备、样品排版等多个页面构成
- 页面：页面由多个组件构成。每个页面对应一个路由。

### 3.1 定义项目路由

路由存放在 `/config/router` 下，你需要新增一个与项目同名的 js 文件。如：测序管理项目（seq）需新建 `seq.js` 路由文件。

### 3.2 新建项目文件夹

所有的项目都存放在 `/src/pages` 下，每一个项目为一个单独的文件夹。如：测序管理项目（seq）需新建 `seq` 项目文件夹。

### 3.3 就近原则

整个系统遵循“就近原则”。如果有的内容只有某一个项目会用到，那么这些内容就应该放到这个项目文件夹内，而不是放到整个代码的根目录或者 src 文件夹下。如果有的内容只有某个页面会用到，那么也应该放到这个页面文件夹内。

<!-- ## 3.4 命名规范

- `/src/models` 全局数据文件夹下文件命名，比如我负责测序模块（seq），那么你的全局数据文件必须命名为 `seq.js`，每一个大模块为一个文件。
- `/src/api` 接口文件夹下的文件命名，根据后台接口微服务命名，一个微服务为一个文件，多个不同的服务不要放到同一个文件内。比如 `basic` 服务，就是 `basic.js`。 -->

## 4. 环境变量
根目录新建 `.env` 文件。
```bash
# BASE_API 决定请求哪个环境的接口，如：使用pre环境接口 BASE_API=pre
BASE_API=
# DEFAULT_ROUTE 项目默认打开的页面，如：测序订单 DEFAULT_ROUTE=/seq/order
DEFAULT_ROUTE=
```

## 5. 接口设置

> 开发默认接口是 `dev`。

修改默认的接口环境：在项目根目录新建 `.env` 文件，输入 `BASE_API=dev`，其中 `dev` 可以改为以下说明中的其他环境。

### 5.1 说明

接口环境现有四种，分别是：

- dev (开发)
- test (测试)
- pre (预生产)
- prod (生产)

一般只有在正式生产服务器才会使用 `prod` 环境（或者有时候需要使用生产数据 debug），开发时一般用其他三种就可以。

## 6. [全局数据](/docs/全局数据.md)

## 7. 负责人

<details>
<summary>展开查看</summary>
<pre><code>
多肽合成：石雷
业务伙伴：石雷
测序管理：孟禹丞
用户权限：孟禹丞
高通量：
RNA合成：吴贺珍
人事管理：吴贺珍
采购管理：张文惠
系统管理：张文慧
</code></pre>
</details>

## 8. 项目结构

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
|   |       |—— api/ 项目用到的接口文件
|   |       |—— assets/ 项目用到的静态资源
|   |       |—— components/ 项目公共组件
|   |       |—— locales/ 项目国际化数据
|   |       |—— mock/ 模拟数据
|   |       |—— models/ 项目全局数据
|   |       |
|   |       |—— seq-order/ 测序订单页面
|   |           |—— components/ 页面拆分的组件
|   |           |—— index.jsx 测序订单入口页面
|   |           |—— index.less 测序订单样式
|   |           |—— model.js 测序订单全局数据
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
