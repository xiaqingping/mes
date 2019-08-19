# 2019-08-19
1. vxe-table 升级 2.0+ 版本，注意控制台警告和错误消息。

# 2019-07-05
1. 修改 `div.table-search a-row` 下，每个栅格（`a-col`）的大小尺寸，提高空间利用率。

``` html
<!-- old -->
<a-col :xxl="4" :xl="6" :md="8" :sm="24">
  <a-form-item label="编号">
    <a-input v-decorator="['code']"/>
  </a-form-item>
</a-col>

<!-- new -->
<a-col :md="6" :xl="4">
  <a-form-item label="编号">
    <a-input v-decorator="['code']"/>
  </a-form-item>
</a-col>
```

# 2019-07-04
1. 依赖升级，可能需要删除掉 `/node_modules` 文件夹，再 `npm install`，直接 `npm install` 可能会升级失败。
2. 项目接口地址和重定向路由都需要通过环境变量来设置，否则默认接口为 `dev`，重定向路由为 `/home`。具体请查看 README.md 文件。

# 2019-07-02
1. 修改系统工具 utils 赋值到 Vue 原型上的命名错误问题

``` javascript
// old
Vue.prototype.$units = utils;

// new 
Vue.prototype.$utils = utils;
```

## 2019-07-01
1. vxe-table 依赖升级

``` javascript
// 表格列配置 columns 属性名变更，旧属性名v3.0废弃
// old
this.columns = [
  { prop: 'name', label: '名称' }
];

// new
this.columns = [
  { field: 'name', title: '名称'}
];
```

## 2019-06-25
1. 依赖更新  
2. views/seq/series示例更新  
   * 表单域回车时，取消默认事件（默认事件导致页面刷新） ~~涉及 `handleSearch`~~ 使用Vue事件修饰符 `.prevent` 取消默认事件
   * 表格增加 editIndex 属性，新增表格时检查是否有正在编辑的行  
   * `vxe-grid` 的两个事件 `@current-page-change` 和 `@page-size-change` 改为最新的 `@page-change`
