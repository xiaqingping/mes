<template>
  <div class="page-content">
    <!-- 搜索 -->
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="2">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="Client">
              <a-input v-decorator="['client']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <!-- 表格内容 -->

    <a-layout>
      <!-- 编号规则 -->
      <!-- 编号规则条件 -->
      <a-layout-content>
        <span style="line-height:32px;">编号规则</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <!-- <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button> -->
          </a-button-group>
        </div>

        <vxe-grid
          highlight-current-row
          highlight-hover-row
          auto-resize
          height="570"
          :ref="codeRuleTable.ref"
          :loading="codeRuleTable.loading"
          :columns="codeRuleTable.columns"
          :pager-config="codeRuleTable.pagerConfig"
          :data.sync="codeRuleTable.tableData"
          :edit-rules="codeRuleTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClick(options)"
          @page-change="pagerChange">
        </vxe-grid>
      </a-layout-content>

      <!-- 编号规则内容 -->
      <a-layout-sider width="350">
        <span style="line-height:32px;">编号规则内容</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus" type="primary">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          height="570"
          :ref="codeRuleContentTable.ref"
          :loading="codeRuleContentTable.loading"
          :columns="codeRuleContentTable.columns"
          :data.sync="codeRuleContentTable.tableData"
          :edit-rules="codeRuleContentTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClickToValue(options)">
        </vxe-grid>
      </a-layout-sider>

      <!-- 编号规则取值 -->
      <a-layout-sider width="350">
        <span style="line-height:32px;">编号规则取值</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus" type="primary">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          height="570"
          :ref="codeRuleValueTable.ref"
          :loading="codeRuleValueTable.loading"
          :columns="codeRuleValueTable.columns"
          :data.sync="codeRuleValueTable.tableData"
          :edit-rules="codeRuleValueTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}">
        </vxe-grid>
      </a-layout-sider>

    </a-layout>
  </div>
</template>

<script>
// import STable from '@/components/Table';

export default {
  names: 'SystemCodeRule',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      // 编号规则
      codeRuleTable: {
        id: 0,
        ref: 'codeRuleTable',
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
          // name: [
          //   { required: true, message: '名称必填' }
          // ]
        }
      },

      // 编号规则内容
      codeRuleContentTable: {
        // parent: 'seriesTable',
        id: 0,
        ref: 'codeRuleContentTable',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      },

      // 编号规则取值
      codeRuleValueTable: {
        // parent: 'seriesTable',
        id: 0,
        ref: 'codeRuleValueTable',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      }
      // columnTwo: [
      //   { title: '值', dataIndex: 'value', width: '60%', align: 'center' },
      //   { title: '优先级', dataIndex: 'level', align: 'center' }
      // ],
      //   return this.$api.system.getDerailList({ contentId: this.loadDataIdOne }).then(res => {

      // 编号规则条件
      // columnThree: [
      //   { title: '字段', dataIndex: 'field', width: '30%', align: 'center' },
      //   { title: 'OP', dataIndex: 'op', width: '30%', align: 'center' },
      //   { title: '文本', dataIndex: 'text', align: 'center' }
      // ],
      //   return this.$api.system.getConditionsList({ detailId: this.loadDataIdTwo }).then(res => {
    };
  },
  mounted () {
    // 编号规则
    this.setColumn();
    this.handleSearch();
    // 编号规则内容
    this.setColumnToContent();
    // 编号规则取值
    this.setColumnToValue();
  },
  methods: {
    /**
     * 编号规则
     */
    // 设置列
    setColumn () {
      const tableName = 'codeRuleTable';
      const columns = [
        { type: 'index', width: 40 },
        { title: 'Client', field: 'client' },
        { title: '规则', field: 'rule' },
        {
          title: '覆盖旧编号',
          field: 'cover',
          align: 'center',
          formatter: function ({ cellValue }) {
            return cellValue === 1 ? '√' : '';
          }
        },
        { title: '开始日期', field: 'dateBegin' },
        { title: '结束日期', field: 'dateEnd' },
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
                <a onClick={() => this.handleCancel(options)}>删除</a>,
                <a onClick={() => this.handleUpdate(options)}>修改</a>
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
      const tableName = 'codeRuleTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.system.getCodeRuleList(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 点击表格行时
    handleCellClick ({ row }) {
      const tableName = 'codeRuleContentTable';
      if (!row.id || row.id < 0) {
        this[tableName].tableData = [];
        return;
      }

      this[tableName].loading = true;
      this.$api.system.getContentList(row.id).then(res => {
        this[tableName].tableData = res.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'codeRuleTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },

    /**
     * 编号规则内容
     */
    // 设置列
    setColumnToContent () {
      const tableName = 'codeRuleContentTable';
      const columns = [
        { type: 'index', width: 40 },
        { title: '位置', field: 'place' },
        { title: '默认值', field: 'value' },
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
    // 点击表格行时
    handleCellClickToValue ({ row }) {
      const tableName = 'codeRuleValueTable';
      if (!row.id || row.id < 0) {
        this[tableName].tableData = [];
        return;
      }

      this[tableName].loading = true;
      this.$api.system.getDerailList(row.id).then(res => {
        this[tableName].tableData = res.rows;
        console.log(res);
      }).finally(() => {
        this[tableName].loading = false;
      });
    },

    /**
     * 编号规则取值
     */
    // 设置列
    setColumnToValue () {
      const tableName = 'codeRuleValueTable';
      const columns = [
        { type: 'index', width: 40 },
        { title: '值', field: 'value' },
        { title: '优先级', field: 'level' },
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
    }

    // 编号规则条件
  }
};
</script>

<style lang='scss' scoped>

</style>
