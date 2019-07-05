<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="2">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="分组名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">分组</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="groupTable.ref"
          :loading="groupTable.loading"
          :columns="groupTable.columns"
          :pager-config="groupTable.pagerConfig"
          :data.sync="groupTable.tableData"
          :edit-rules="groupTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClick(options)"
          @page-change="pagerChange">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="80%">
        <span style="line-height:32px;">规则分组</span>
        <div class="table-operator">
          <a-button-group>
            <!-- <a-button icon="search" @click="handleSearchToRule">查询</a-button> -->
            <a-button icon="sync" @click="handleRefresh">刷新</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRowToRule">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="groupRuleTable.ref"
          :loading="groupRuleTable.loading"
          :columns="groupRuleTable.columns"
          :data.sync="groupRuleTable.tableData"
          :edit-rules="groupRuleTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}">
        </vxe-grid>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: 'SystemGroup',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),

      queryParam: {},
      groupTable: {
        id: 0,
        ref: 'groupTable',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {
          name: [
            { required: true, message: '名称必填' }
          ]
        }
      },

      groupRuleTable: {
        id: 0,
        ref: 'groupRuleTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      }
    };
  },
  mounted () {
    this.setColumn();
    this.setColumnToRule();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'groupTable';
      const columns = [
        { type: 'index', width: 40 },
        { title: '分组名称', field: 'name', editRender: { name: 'input' }, width: '60%' },
        {
          title: '操作',
          field: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };

              actions = [
                <a onClick={() => this.handleCancel(options)}>删除</a>
                // <a onClick={() => this.handleUpdate(options)}>修改</a>
              ];
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleQuitEdit(options) }>退出</a>
                ];
              }

              return [
                <span class="table-actions" onClick={(event) => event.stopPropagation()}>
                  {actions}
                </span>
              ];
            }
          }
        }
      ];

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch (e) {
      if (e) e.preventDefault();
      const tableName = 'groupTable';
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.system.getGroups(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRow () {
      // alert(123);
      const tableName = 'groupTable';
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      const newData = {
        id: --this[tableName].id
      };

      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
      this[tableName].editIndex = 0;
    },
    // 保存
    handleSave (o) {
      // this.$api.system.inserGroups(row).then((res) => {
      //   // this.handleSearch();
      //   console.log(res);
      // });
      console.log(o);
      if (o.row.name === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var data = {};
      // if (o.row.id) {
      //   data = o.row;
      // }
      data.name = o.row.name;
      this.$api.system.inserGroups(data).then(res => {
        if (res.id) {
          this.handleSearch();
        }
      });
    },
    // 退出编辑
    handleQuitEdit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived().then(() => {
        this[tableName].editIndex = -1;
        if (!row.status) {
          this[tableName].tableData.splice(rowIndex, 1);
        } else {
          this.$set(this[tableName].tableData, rowIndex, this[tableName].editData);
          this[tableName].editData = null;
        }
      });
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'groupTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },

    // 点击载体表格时
    handleCellClick ({ row }) {
      const tableName = 'groupRuleTable';
      if (!row.id || row.id < 0) {
        this[tableName].tableData = [];
        return;
      }
      this[tableName].loading = true;
      this.$api.system.getGroupRules(row.id).then(res => {
        this[tableName].tableData = res.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 刷新
    handleRefresh () {
      alert(123);
    },

    /**
     * 规则分组
     */
    // 为规则分组设置列
    setColumnToRule () {
      const tableName = 'groupRuleTable';
      // const { formatter } = this.$units;
      // const { system } = this.$store.state;
      const columns = [
        { title: '名称', field: 'name' },
        { title: 'Client', field: 'sourceClient', editRender: { name: 'AInput' } },
        { title: 'Type', field: 'sourceType' },
        { title: '资源', field: 'sourcePath' },
        { title: '资源描述', field: 'sourceDesc' },
        { title: '参数类型', field: 'paramType' },
        { title: '参数', field: 'parameterField' },
        { title: '参数描述', field: 'parameterDesc' },
        { title: 'OP', field: 'op' },
        { title: '值', field: 'value' },
        { title: '状态', field: 'status' },
        {
          title: '操作',
          field: 'actions',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };
              if (!isEdit) {
                actions = [
                  <a onClick={() => this.handleCancel(options)}>删除</a>
                ];
              } else {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleQuitEdit(options) }>退出</a>
                ];
              }
              return [
                <span class="table-actions">
                  {actions}
                </span>
              ];
            }
          }
        }
      ];

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 新增一可编辑行
    handleAddRowToRule () {
      const tableName = 'groupRuleTable';
      const table = this.$refs[tableName].$refs.xTable;
      const newData = {
        id: --this[tableName].id,
        name: ''
      };
      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
    }
  }
};
</script>
