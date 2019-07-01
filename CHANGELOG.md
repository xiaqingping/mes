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
