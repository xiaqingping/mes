import Vue from 'vue';
import {
  VXETable,
  Table,
  Column,
  Cell,
  Header,
  Body,
  Footer,
  Icon,
  Filter,
  Loading,
  Tooltip,
  Grid,
  // Excel,
  Menu,
  Toolbar,
  Pager,
  Checkbox,
  Radio,
  Input,
  // Button,
  // Message,
  // Export,
  Resize
} from 'vxe-table';
import VXETablePluginAntd from 'vxe-table-plugin-antd';
import zhCNLocat from 'vxe-table/lib/locale/lang/zh-CN';

Vue.use(Table);
Vue.use(Column);
Vue.use(Cell);
Vue.use(Header);
Vue.use(Body);
Vue.use(Footer);
Vue.use(Icon);
Vue.use(Filter);
Vue.use(Loading);
Vue.use(Tooltip);
Vue.use(Grid);
// Vue.use(Excel)
Vue.use(Menu);
Vue.use(Toolbar);
Vue.use(Pager);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Input);
// Vue.use(Button);
// Vue.use(Message);
// Vue.use(Export);
Vue.use(Resize);

// 全局默认设置
VXETable.setup({
  // 默认尺寸
  size: 'small',
  // 所有内容超过隐藏
  showOverflow: 'title',
  // 所有表头内容超过隐藏
  showHeaderOverflow: null,
  // 条纹
  stripe: true,
  // 边框
  border: true,
  // 拖拽列宽
  resizable: true,
  // 列宽自动撑开
  fit: true,
  // 显示表头
  showHeader: true,
  // 版本号（对于某些带 Storage 数据储存的功能有用到，上升版本号可以用于重置 Storage 数据）
  version: 0,
  // 默认快捷菜单
  menu: null,
  // 默认 tooltip 主题样式
  tooltip: {
    zIndex: 9999,
    theme: 'dark'
  },
  // 默认分页参数
  pager: {
    pageSize: 10,
    pagerCount: 1,
    pageSizes: [10, 50, 100],
    layouts: ['PrevPage', 'NextPage', 'Sizes', 'Total']
  },
  // 默认工具栏参数
  toolbar: {
    setting: false,
    buttons: []
  },
  // 默认消息提示框参数
  message: {
    zIndex: 999,
    lockView: true,
    lockScroll: true,
    mask: true,
    duration: 3000,
    animat: true
  },
  // 默认优化配置项
  optimization: {
    animat: true,
    // 当列大于 40 条时自动启用横向 X 滚动渲染
    scrollX: {
      gt: 40,
      oSize: 5,
      rSize: 16
    },
    // 当数据大于 500 条时自动启用纵向 Y 滚动渲染
    scrollY: {
      gt: 500,
      oSize: 20,
      rSize: 80
    }
  },
  i18n: (key, value) => VXETable.t(zhCNLocat, key)
});

VXETable.use(VXETablePluginAntd);

// 自定义渲染器
VXETable.renderer.add('SInputSearch', {
  autofocus: '.ant-input',
  renderEdit (h, editRender, params) {
    const { $table, row, column } = params;
    return [
      <a-input-search
        size={ $table.vSize }
        v-model={row[column.property]}
        onSearch={ editRender.events.search } />
    ];
  },
  renderCell (h, editRender, { row, column }) {
    return [
      <span>{row[column.property]}</span>
    ];
  }
});

VXETable.renderer.add('SCheckBox', {
  autofocus: '.ant-checkbox-input',
  renderEdit (h, editRender, params) {
    const { $table, row, column } = params;
    return [
      <a-checkbox
        size={ $table.vSize }
        value={row[column.property]}
        onChange={ editRender.events.change }
      >
      </a-checkbox>
    ];
  },
  renderCell (h, editRender, { row, column }) {
    return [
      <span>{row[column.property]}</span>
    ];
  }
});
