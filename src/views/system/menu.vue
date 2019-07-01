<template>
  <div class="page-content">

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">菜单</span>
        <div class="table-operator">
          <a-button-group>
            <a-button v-action:search icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="save" type="primary">保存</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="menuTable.ref"
          :loading="menuTable.loading"
          :columns="menuTable.columns"
          :data.sync="menuTable.tableData"
          :edit-rules="menuTable.editRules"
          :tree-config="{key: 'name', children: 'children'}"
          :edit-config="{key: 'id', trigger: 'click', mode: 'row', showIcon: false, autoClear: false}">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="300">
        <span style="line-height:32px;">按钮</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="edit" type="primary">修改</a-button>
          </a-button-group>
        </div>

        <!-- <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="seriesPrimersTable.ref"
          :loading="seriesPrimersTable.loading"
          :columns="seriesPrimersTable.columns"
          :data.sync="seriesPrimersTable.tableData"
          :edit-rules="seriesPrimersTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}">
        </vxe-grid> -->
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
import { asyncRouterMap } from '@/router/config/index';

export default {
  name: 'SystemMenu',
  components: {
  },
  data () {
    return {
      menuTable: {
        id: 0,
        ref: 'menuTable',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      }
    };
  },
  mounted () {
    this.setColumn();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'menuTable';
      const columns = [
        { type: 'index', width: 40 },
        { title: '菜单', field: 'name', treeNode: true },
        { title: '链接', field: 'url' },
        { title: '图标', field: 'note', editRender: { name: 'input' } },
        { title: '排序', field: 'serial', editRender: { name: 'input' } }
      ];

      // columns.forEach(function (e) {
      //   if (!e.width) e.width = 100;
      // });

      this[tableName].columns = columns;
      this[tableName].editRules = {
        name: [
          { required: true, message: '名称不能为空' }
        ]
      };

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'menuTable';
      const menu = this.formatMenu(JSON.parse(JSON.stringify(asyncRouterMap[0].children)));
      this[tableName].tableData = menu;
    },
    // 格式化菜单数据
    formatMenu (menu) {
      var arr = menu.map((e, i) => {
        const obj = {
          name: e.meta.title,
          url: e.path,
          note: e.meta.icon,
          serial: i + 1
        };
        if (e.children) {
          obj.children = this.formatMenu(e.children);
        }
        return obj;
      });
      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
