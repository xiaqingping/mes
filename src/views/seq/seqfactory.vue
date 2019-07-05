<!-- 测序点 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
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
          <a-col :md="6" :xl="4">
            <a-form-item label="测序工厂">
              <a-select v-decorator="['factory', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="factory in $store.state.basic.factorys" :value="factory.code" :key="factory.code">{{ factory.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">测序点</span>
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
          ref="seqfactoryTable"
          :loading="seqfactoryTable.loading"
          :columns="seqfactoryTable.columns"
          :pager-config="seqfactoryTable.pagerConfig"
          :data.sync="seqfactoryTable.tableData"
          :edit-rules="seqfactoryTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="({row}) => handleSearchOffice(row.id)"
          @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: seqfactoryTable, callback: handleSearch})">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="200">
        <span style="line-height:32px;">网点</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus" type="primary" @click="handleAddRowToOffice">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          height="570"
          ref="seqfactoryOfficeTable"
          :loading="seqfactoryOfficeTable.loading"
          :columns="seqfactoryOfficeTable.columns"
          :data.sync="seqfactoryOfficeTable.tableData"
          :edit-rules="seqfactoryOfficeTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}">
        </vxe-grid>
      </a-layout-sider>
    </a-layout>

  </div>
</template>

<script>
export default {
  name: 'SeqFactory',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      seqfactoryTable: {
        child: 'seqfactoryOfficeTable',
        id: 0,
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
      seqfactoryOfficeTable: {
        parent: 'seqfactoryTable',
        id: 0,
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
    this.handleSearch();

    this.setColumnToOffice();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'seqfactoryTable';
      const { formatter } = this.$utils;
      const { basic } = this.$store.state;

      const columns = [
        { type: 'radio', width: 40 },
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name', editRender: { name: 'input' } },
        {
          title: 'SAP工厂',
          field: 'factory',
          formatter: function ({ cellValue }) { return formatter(basic.factorys, cellValue, 'code', 'text'); },
          editRender: {
            name: 'ASelect',
            options: basic.factorys,
            optionProps: { value: 'code', label: 'text' }
          }
        },
        {
          label: '仓库',
          field: 'storageCode',
          formatter: function ({ cellValue }) { return formatter(basic.storages, cellValue, 'code', 'text'); },
          editRender: {
            name: 'ASelect',
            options: basic.storages,
            optionProps: { value: 'code', label: 'text' },
            events: {
              change: ({ row, rowIndex }, value) => { this.storagesChange(basic.storages, row, value); }
            }
          }
        },
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

      // 列
      this[tableName].columns = columns;
      // 编辑规则
      this[tableName].editRules = {
        name: [
          { required: true, message: '必填' }
        ],
        factory: [
          { required: true, message: '必填' }
        ],
        storageCode: [
          { required: true, message: '必填' }
        ]
      };

      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'seqfactoryTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.seqfactory.getSeqfactory(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        // 重置子列表
        this.handleSearchOffice();
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRow () {
      const tableName = 'seqfactoryTable';
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
      this.$api.seqfactory.cancelSeqfactory(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row, xTable }) {
      xTable.validate(row).then(() => {
        if (row.status) {
        // 修改
          this.$api.seqfactory.updateSeqfactory(row).then(() => {
            this.handleSearch();
          });
        } else {
        // 新增
          this.$api.seqfactory.addSeqfactory(row).then(() => {
            this.handleSearch();
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 选择仓库
    storagesChange (arr, row, value) {
      let obj = {};
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].code === value) {
          obj = {
            storageCode: arr[i].code,
            storageName: arr[i].name
          };
          break;
        }
      }
      row = Object.assign(row, obj);
    },

    /**
     * 测序点之网点
     */
    setColumnToOffice () {
      const tableName = 'seqfactoryOfficeTable';
      const { formatter } = this.$utils;
      const { basic } = this.$store.state;

      const columns = [
        {
          title: '网点',
          field: 'code',
          formatter: function ({ cellValue }) { return formatter(basic.offices, cellValue, 'code', 'name'); },
          editRender: {
            name: 'ASelect',
            options: basic.offices,
            optionProps: { value: 'code', label: 'name' },
            events: {
              change: ({ row, rowIndex }, value) => { this.officeChange(basic.offices, row, value); }
            }
          }
        },
        {
          title: '操作',
          field: 'actions',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };

              if (!isEdit && row.id > 0) {
                actions = [
                  <a onClick={ () => this.handleCancelOffice(options) }>删除</a>
                ];
              }
              if (isEdit) {
                actions = [
                  <a onClick={ () => this.handleSaveOffice(options) }>保存</a>,
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

      // 列
      this[tableName].columns = columns;
      // 编辑规则
      this[tableName].editRules = {
        code: [
          { required: true, message: '网点必填' }
        ]
      };

      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearchOffice (seqfactoryId) {
      const tableName = 'seqfactoryOfficeTable';

      if (!seqfactoryId || seqfactoryId < 0) {
        this[tableName].tableData = [];
        return;
      }

      this[tableName].loading = true;
      this.$api.seqfactory.getOfficeBySeqfactory(seqfactoryId).then(res => {
        this[tableName].tableData = res;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRowToOffice () {
      const tableName = 'seqfactoryOfficeTable';
      const table = this[tableName].xTable;
      const parentTable = this[this[tableName].parent].xTable;
      const selectRow = parentTable.getCurrentRow();
      if (!selectRow) return this.$message.warning('请先选择左侧列表的一行');
      if (selectRow.status !== 1) return this.$message.warning('只能为状态正常的测序点添加网点');
      const active = table.getActiveRow();
      if (active && active.row) return this.$message.warning('请保存或退出正在编辑的行');

      const newData = {
        seqfactoryId: selectRow.id,
        id: --this[tableName].id
      };
      table.insert(newData).then(({ row }) => {
        table.setActiveRow(row);
      });
    },
    // 删除网点
    handleCancelOffice ({ row }) {
      this.$api.seqfactory.cancelOfficeBySeqfactory(row).then(() => {
        this.handleSearchOffice(row.seqfactoryId);
      });
    },
    // 保存网点
    handleSaveOffice ({ row, xTable }) {
      xTable.validate(row).then(() => {
        this.$api.seqfactory.addOfficeBySeqfactory(row).then(() => {
          this.handleSearchOffice(row.seqfactoryId);
        });
      }).catch(err => {
        console.log(err);
      });
    },
    // 选择网点
    officeChange (arr, row, value) {
      let obj = {};
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].code === value) {
          obj = {
            code: arr[i].code,
            name: arr[i].name
          };
          break;
        }
      }
      row = Object.assign(row, obj);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
