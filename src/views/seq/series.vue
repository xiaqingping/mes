<!-- 载体系列 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">系列</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="seriesTable.ref"
          :loading="seriesTable.loading"
          :columns="seriesTable.columns"
          :pager-config="seriesTable.pagerConfig"
          :data.sync="seriesTable.tableData"
          :edit-rules="seriesTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClick(options)"
          @page-change="pagerChange">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="300">
        <span style="line-height:32px;">引物</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus" type="primary" @click="handleAddRowToPrimers">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="seriesPrimersTable.ref"
          :loading="seriesPrimersTable.loading"
          :columns="seriesPrimersTable.columns"
          :data.sync="seriesPrimersTable.tableData"
          :edit-rules="seriesPrimersTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}">
        </vxe-grid>
      </a-layout-sider>
    </a-layout>

  </div>
</template>

<script>
export default {
  name: 'Series',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      seriesTable: {
        id: 0,
        ref: 'seriesTable',
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
      seriesPrimersTable: {
        id: 0,
        ref: 'seriesPrimersTable',
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
    this.setColumnToPrimer();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'seriesTable';
      const { formatter } = this.$units;
      const { basic } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { label: '编号', prop: 'code' },
        { label: '名称', prop: 'name', editRender: { name: 'input' } },
        { label: '状态', prop: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改人', prop: 'changerName' },
        { label: '修改时间', prop: 'changeDate' },
        { label: '作废人', prop: 'cancelName' },
        { label: '作废时间', prop: 'cancelDate' },
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
                  <a onClick={() => this.handleCancel(options)}>删除</a>,
                  <a onClick={() => this.handleUpdate(options)}>修改</a>
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

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'seriesTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.series.getSeries(params, true).then((data) => {
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
      const tableName = 'seriesTable';
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      const newData = {
        id: --this[tableName].id
      };

      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
      this[tableName].editIndex = 0;
    },
    // 修改
    handleUpdate ({ row, rowIndex, tableName, xTable }) {
      xTable.setActiveRow(row);
      this[tableName].editIndex = rowIndex;
      this[tableName].editData = JSON.parse(JSON.stringify(row));
    },
    // 删除
    handleCancel ({ row }) {
      this.$api.series.cancelSeries(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row }) {
      if (row.status) {
        // 修改
        this.$api.series.updateSeries(row).then(() => {
          this.handleSearch();
        });
      } else {
        // 新增
        this.$api.series.addSeries(row).then(() => {
          this.handleSearch();
        });
      }
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
    // 点击载体表格时
    handleCellClick ({ row }) {
      if (!row.id || row.id < 0) return;

      const tableName = 'seriesPrimersTable';
      this[tableName].loading = true;
      this.$api.series.getPrimersBySeries(row.id).then(res => {
        this[tableName].tableData = res;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'seriesTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },

    /**
     * 系列之引物
     */
    // 为系列之引物设置列
    setColumnToPrimer () {
      const tableName = 'seriesPrimersTable';
      const { formatter } = this.$units;
      const { seq } = this.$store.state;
      const columns = [
        { label: '引物编号', prop: 'code' },
        { label: '引物名称', prop: 'name', editRender: { name: 'AInput' } },
        { label: '引物类型', prop: 'type', formatter: function ({ cellValue }) { return formatter(seq.primerType, cellValue); } },
        {
          label: '操作',
          prop: 'actions',
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
    handleAddRowToPrimers () {
      const tableName = 'seriesPrimersTable';
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

<style lang="scss" scoped>

</style>
