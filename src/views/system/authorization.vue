<template>
  <div class="page-content">
    <!-- 查询搜索 -->
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <!-- 中间内容 -->

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">员工列表</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="authorizationTable.ref"
          :loading="authorizationTable.loading"
          :columns="authorizationTable.columns"
          :pager-config="authorizationTable.pagerConfig"
          :data.sync="authorizationTable.tableData"
          :edit-rules="authorizationTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClick(options)"
          @page-change="pagerChange">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="20%">
        <span style="line-height:32px;">用户权限明细</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search">查询</a-button>
            <!-- <a-button icon="search" @click="handleSearchToClient">查询</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRowToClient">新建</a-button> -->
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="clientTable.ref"
          :loading="clientTable.loading"
          :columns="clientTable.columns"
          :data.sync="clientTable.tableData"
          :edit-rules="clientTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClickToClient(options)">
        </vxe-grid>
      </a-layout-sider>

      <a-layout-sider width="50%">
        <span style="line-height:32px;">明细</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search">查询</a-button>
            <!-- <a-button icon="search" @click="handleSearchToClient">查询</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRowToClient">新建</a-button> -->
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

    <!-- <authorization-mask v-show="authorization_status" @Closed="closeMask()">
    </authorization-mask> -->

  </div>
</template>

<script>
// import AuthorizationMask from '@/components/system/authorization_mask';

export default {
  name: 'SystemAuthorization',
  components: {
    // AuthorizationMask
  },
  data () {
    return {
      form: this.$form.createForm(this),
      // authorization_status: false,
      // 员工列表
      authorizationTable: {
        id: 0,
        ref: 'authorizationTable',
        xTable: null,
        editIndex: -1,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {
          // name: [
          //   { required: true, message: '名称必填' }
          // ]
        },
        clickStatus: null
      },
      clientTable: {
        id: 0,
        ref: 'clientTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
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

      //   const params = this.loadDataIdOne;
      //   return this.$api.system.getGroupRulesList(params).then(res => {
    };
  },
  mounted () {
    // 员工列表
    this.setColumn();
    this.handleSearch();
    // 用户权限明细
    this.setColumnToClient();
    // 明细
    this.setColumnToGrounpRules();
  },
  methods: {
    /**
     * 员工列表
     */
    // 设置列
    setColumn () {
      const tableName = 'authorizationTable';
      // const { formatter } = this.$units;
      // const { system } = this.$store.state;
      const columns = [
        { type: 'index', width: 40 },
        { title: 'ID', field: 'code' },
        { title: '姓名', field: 'name' },
        { title: '员工号', field: 'employeeCode' },
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

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });
      this[tableName].columns = columns;
      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch (e) {
      if (e) e.preventDefault();
      const tableName = 'authorizationTable';
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.system.getDataAuthList(params, true).then((data) => {
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
      alert(123);
      const tableName = 'authorizationTable';
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      const newData = {
        id: --this[tableName].id
      };

      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
      this[tableName].editIndex = 0;
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      // alert(1);
      const tableName = 'authorizationTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    // 点击载体表格时
    handleCellClick ({ row }) {
      const tableName = 'clientTable';
      if (!row.id || row.id < 0) {
        this[tableName].tableData = [];
        return;
      }
      this[tableName].loading = true;
      this.$api.system.getAuthorityList(row.id).then(res => {
        this[tableName].tableData = res;
        // row['status'] = 1;
        // this.$options.methods.handleCellClickToClient(row);
        // console.log(res);
      }).finally(() => {
        this[tableName].loading = false;
      });
    },

    /**
     * 用户权限明细
     */
    // 设置列 - 用户权限明细
    setColumnToClient () {
      const tableName = 'clientTable';
      const { formatter } = this.$units;
      const { system } = this.$store.state;
      const columns = [
        { type: 'index', width: 40 },
        { title: '类型', field: 'ruleType', formatter: function ({ cellValue }) { return formatter(system.ruleType, cellValue); } },
        { title: '权限', field: 'ruleName' },
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
    // 点击载体表格时
    handleCellClickToClient ({ row }) {
      // console.log(row.status);
      const tableName = 'groupRuleTable';
      if (!row.id || row.id < 0) {
        this[tableName].tableData = [];
        return;
      }
      this[tableName].loading = true;
      this.$api.system.getGrouprulesList(row.ruleId).then(res => {
        this[tableName].tableData = res.rows;
        // console.log(res.rows);
      }).finally(() => {
        this[tableName].loading = false;
      });
    },

    /**
     * 明细
     */
    // 设置列 - 明细
    setColumnToGrounpRules () {
      const tableName = 'groupRuleTable';
      const { formatter } = this.$units;
      const { system } = this.$store.state;
      const columns = [
        { type: 'index', width: 40 },
        { title: '名称', field: 'name' },
        { title: 'Client', field: 'sourceClient' },
        { title: 'Type', field: 'sourceType' },
        { title: '资源', field: 'sourcePath' },
        { title: '资源描述', field: 'sourceDesc' },
        { title: '类型参数', field: 'paramType', formatter: function ({ cellValue }) { return formatter(system.paramType, cellValue); } },
        { title: '参数', field: 'parameterField' },
        { title: '参数描述', field: 'parameterDesc' },
        { title: 'OP', field: 'op' },
        { title: '值', field: 'value' },
        { title: '状态', field: 'status', formatter: function ({ cellValue }) { if (cellValue === 0) { cellValue = '0'; } return formatter(system.status, cellValue); } },
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
    // 模态框展示
    // showDrawer () {
    //   this.visible = true;
    // },
    // onClose () {
    //   this.visible = false;
    // },

    // openMask () {
    //   this.authorization_status = true;
    // },
    // closeMask () {
    //   this.authorization_status = false;
    // },

    toggleAdvanced () {
      this.advanced = !this.advanced;
    }
  }
};
</script>
