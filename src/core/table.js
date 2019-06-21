import Vue from 'vue';
import {
  VXETable,
  Table,
  Column,
  Header,
  Body,
  Footer,
  Filter,
  Loading,
  Grid,
  // Excel,
  Menu,
  Toolbar,
  Pager,
  Checkbox,
  Radio,
  Input,
  Button,
  Message,
  Export,
  Resize
} from 'vxe-table';
import VXETablePluginAntd from 'vxe-table-plugin-antd';
import zhCNLocat from 'vxe-table/lib/locale/lang/zh-CN';

Vue.use(Table);
Vue.use(Column);
Vue.use(Header);
Vue.use(Body);
Vue.use(Footer);
Vue.use(Filter);
Vue.use(Loading);
Vue.use(Grid);
// Vue.use(Excel);
Vue.use(Menu);
Vue.use(Toolbar);
Vue.use(Pager);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Input);
Vue.use(Button);
Vue.use(Message);
Vue.use(Export);
Vue.use(Resize);

// 按需加载的方式默认是不带国际化的，需要自行导入
VXETable.setup({
  i18n: (key, value) => VXETable.t(zhCNLocat, key)
});

// 按需加载的方式默认是不带国际化的，需要自行导入
VXETable.setup({
  // 默认尺寸
  size: 'mini',
  // 所有内容超过隐藏
  showAllOverflow: 'title',
  // 所有表头内容超过隐藏
  showHeaderAllOverflow: 'title',
  // 默认 tooltip 主题样式
  tooltip: {
    zIndex: 3000,
    theme: 'dark'
  },
  // 默认分页参数
  pager: {
    pageSize: 10,
    pagerCount: 1,
    pageSizes: [10, 50, 100],
    layouts: ['PrevPage', 'NextPage', 'Sizes', 'Total']
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
  }
  // i18n: (key, value) => VXETable.t(zhCNLocat, key)
});

VXETable.use(VXETablePluginAntd);
