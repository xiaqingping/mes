
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="员工编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="14">
            <a-form-item label="员工名称">
              <a-input v-decorator="['staffName']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="类型：">
              <a-select v-decorator="['type', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="type in $store.state.pay.type" :value="type.id" :key="type.id">{{ type.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.pay.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
      </a-button-group>
    </div>
    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="payrollTable.ref"
      :loading="payrollTable.loading"
      :columns="payrollTable.columns"
      :pager-config="payrollTable.pagerConfig"
      :data.sync="payrollTable.tableData"
      :edit-rules="payrollTable.editRules"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @page-change="pagerChange">
    </vxe-grid>
  </div>
</template>

<script>

export default {
  // name: 'payrollTable',
  components: {},
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      payrollTable: {
        id: 0,
        ref: 'payrollTable',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {},
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
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
      const tableName = 'payrollTable';
      const { formatter } = this.$utils;
      const { pay } = this.$store.state;

      const columns = [
        { width: 40, type: 'index' },
        { label: '编号', prop: 'code' },
        { label: '名称', prop: 'name', editRender: { name: 'input' } },
        { label: '类型', prop: 'type', editRender: { name: 'input' } },
        { label: '排序', prop: 'serial', editRender: { name: 'input' } },
        { label: '状态', prop: 'status', formatter: function ({ cellValue }) { return formatter(pay.status, cellValue); } },
        { label: '创建人', prop: 'createName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改人', prop: 'updateName' },
        { label: '修改时间', prop: 'updateDate' },
        {
          label: '操作',
          prop: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };

              if (!isEdit && row.status === 1) {
                actions = [
                  <a onClick={() => this.handleCancel(options)}>删除</a>
                ];
              }
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

      this[tableName].editRules = {
        name: [
          { required: true, message: '名称不能为空' }
        ],
        alias: [
          { required: true, message: '类型不能为空' }
        ]
      };

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'payrollTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.pay.getTypepay(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增
    handleAddRow () {
      const tableName = 'payrollTable';
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      const newData = {
        id: --this[tableName].id
      };

      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
      this[tableName].editIndex = 0;
    },
    // 删除
    handleCancel ({ row }) {
      this.$api.pay.deleteTypepays(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row, rowIndex, tableName, xTable }) {
      xTable.validate(row).then(() => {
        if (row.status) {
        // 修改（暂时没有修改功能）
        } else {
        // 新增
          this.$api.pay.increaseTypepay(row).then(() => {
            this.handleSearch();
          });
        }
      }).catch(() => {
        this.$message.warning('表格验证未通过');
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
      const tableName = 'payrollTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    }
  }
};
</script>
<style lang="scss" scoped></style>
