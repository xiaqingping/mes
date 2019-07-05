<!-- 载体系列 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
        <a-row :gutter="24">
          <a-col :md="6" :xl="4">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
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
          highlight-current-row
          highlight-hover-row
          auto-resize
          height="570"
          :ref="seriesTable.ref"
          :loading="seriesTable.loading"
          :columns="seriesTable.columns"
          :pager-config="seriesTable.pagerConfig"
          :data.sync="seriesTable.tableData"
          :edit-rules="seriesTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="({row}) => handleSearchPrimer(row.id)"
          @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: seriesTable, callback: handleSearch})">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="350">
        <span style="line-height:32px;">引物</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus" type="primary" @click="handleAddRowToPrimers">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          height="570"
          :ref="seriesPrimersTable.ref"
          :loading="seriesPrimersTable.loading"
          :columns="seriesPrimersTable.columns"
          :data.sync="seriesPrimersTable.tableData"
          :edit-rules="seriesPrimersTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}">
        </vxe-grid>
      </a-layout-sider>
    </a-layout>

    <a-modal
      title="选择引物"
      width="1000px"
      :visible="choosePrimer.visible"
      :footer="null"
      @cancel="choosePrimer.visible = false">
      <choose-primer @callback="setPrimerBySelect"></choose-primer>
    </a-modal>
  </div>
</template>

<script>
import ChoosePrimer from '@/components/seq/choosePrimer';

export default {
  name: 'SeqSeries',
  components: {
    ChoosePrimer
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      seriesTable: {
        child: 'seriesPrimersTable',
        id: 0,
        ref: 'seriesTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {}
      },
      seriesPrimersTable: {
        parent: 'seriesTable',
        id: 0,
        ref: 'seriesPrimersTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      },
      choosePrimer: {
        visible: false,
        formData: {}
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
      const { formatter } = this.$utils;
      const { basic } = this.$store.state;

      const columns = [
        { type: 'radio', width: 40 },
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name', editRender: { name: 'input' } },
        { title: '状态', field: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { title: '创建人', field: 'creatorName' },
        { title: '创建时间', field: 'createDate' },
        { title: '修改人', field: 'changerName' },
        { title: '修改时间', field: 'changeDate' },
        { title: '作废人', field: 'cancelName' },
        { title: '作废时间', field: 'cancelDate' },
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

              if (!isEdit && row.status === 1) {
                actions = [
                  <a onClick={ () => this.handleCancel(options) }>删除</a>,
                  <a onClick={ () => xTable.setActiveRow(row) }>修改</a>
                ];
              }
              if (isEdit) {
                actions = [
                  <a onClick={ () => this.handleSave(options) }>保存</a>,
                  <a onClick={ () => this.$utils.tableQuitEdit(options) }>退出</a>
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
          { required: true, message: '名称必填' }
        ]
      };

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

        // 重置子列表
        this.handleSearchPrimer();
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRow () {
      const tableName = 'seriesTable';
      const table = this[tableName].xTable;

      const active = table.getActiveRow();
      if (active && active.row) return this.$message.warning('请保存或退出正在编辑的行');

      const newData = {
        id: --this[tableName].id
      };

      table.insert(newData).then(({ row }) => {
        table.setActiveRow(row);
      });
    },
    // 删除
    handleCancel ({ row }) {
      this.$api.series.cancelSeries(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row, xTable }) {
      xTable.validate(row).then(() => {
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
      }).catch(err => {
        console.log(err);
      });
    },

    /**
     * 系列之引物
     */
    // 为系列之引物设置列
    setColumnToPrimer () {
      const tableName = 'seriesPrimersTable';
      const { formatter } = this.$utils;
      const { seq } = this.$store.state;
      const columns = [
        { title: '引物编号', field: 'code' },
        { title: '引物名称', field: 'name', editRender: { name: 'SInputSearch', events: { search: this.selectPrimer } } },
        { title: '引物类型', field: 'type', formatter: function ({ cellValue }) { return formatter(seq.primerType, cellValue); } },
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
                  <a onClick={() => this.handleCancelPrimer(options)}>删除</a>
                ];
              } else {
                actions = [
                  <a onClick={() => this.handleSavePrimer(options) }>保存</a>,
                  <a onClick={() => this.$utils.tableQuitEdit(options) }>退出</a>
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
      this[tableName].editRules = {
        name: [
          { required: true, message: '名称必填' }
        ]
      };

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearchPrimer (seriesId) {
      const tableName = 'seriesPrimersTable';

      if (!seriesId || seriesId < 0) {
        this[tableName].tableData = [];
        return;
      }

      this[tableName].loading = true;
      this.$api.series.getPrimersBySeries(seriesId).then(res => {
        this[tableName].tableData = res;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRowToPrimers () {
      const tableName = 'seriesPrimersTable';
      const table = this[tableName].xTable;
      const parentTable = this[this[tableName].parent].xTable;
      const selectRow = parentTable.getCurrentRow();
      if (!selectRow) return this.$message.warning('请先选择左侧列表的一行');
      if (selectRow.status !== 1) return this.$message.warning('只能为状态正常的系列添加引物');

      const newData = {
        seriesId: selectRow.id,
        id: --this[tableName].id
      };
      table.insert(newData).then(({ row }) => {
        table.setActiveRow(row);
      });
    },
    // 显示引物选择框
    selectPrimer () {
      this.choosePrimer.visible = true;
    },
    // 设置引物
    setPrimerBySelect (data) {
      const tableName = 'seriesPrimersTable';
      const table = this[tableName].xTable;
      const primer = {
        primerId: data.id,
        code: data.code,
        name: data.name,
        type: data.type
      };
      Object.assign(table.getInsertRecords()[0], primer);

      this.choosePrimer.visible = false;
    },
    // 保存引物
    handleSavePrimer ({ row, xTable }) {
      xTable.validate(row).then(() => {
        this.$api.series.addPrimersBySeries(row).then(() => {
          this.handleSearchPrimer(row.seriesId);
        });
      }).catch(err => {
        console.log(err);
      });
    },
    // 删除引物
    handleCancelPrimer ({ row }) {
      this.$api.series.cancelPrimersBySeries(row).then(() => {
        this.handleSearchPrimer(row.seriesId);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
