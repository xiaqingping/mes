<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="规则名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="Client">
                <a-input v-decorator="['sourceClient']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="参数">
                <a-input v-decorator="['parameterField']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="Type">
                <a-select v-decorator="['sourceType']">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in type" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="资源">
                <a-input-search v-decorator="['sourcePath']" />
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="参数类型">
                <a-select v-decorator="['paramType']">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in paramType" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-decorator="['status']">
                  <a-select-option v-for="item in status" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="plus" @click="handleAddRow">新建</a-button>
      </a-button-group>
      <a @click="toggleAdvanced" style="margin-left: 8px">
        {{ advanced ? '收起' : '展开' }}
        <a-icon :type="advanced ? 'up' : 'down'"/>
      </a>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="ruleTable.ref"
      :loading="ruleTable.loading"
      :columns="ruleTable.columns"
      :pager-config="ruleTable.pagerConfig"
      :data.sync="ruleTable.tableData"
      :edit-rules="ruleTable.editRules"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @page-change="pagerChange"
    >
    </vxe-grid>

  </div>
</template>

<script>
export default {
  name: 'SystemRule',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      advanced: true,
      type: [],
      paramType: [],
      status: [],
      queryParam: {},

      ruleTable: {
        id: 0,
        ref: 'ruleTable',
        xTable: null,
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
            { required: true, message: '规则名称必填' }
          ]
        }
      }
    };
  },
  mounted () {
    this.setColumn();
    // this.setEditRules();
    this.handleSearch();

    this.type = this.$store.state.system.type;
    this.paramType = this.$store.state.system.paramType;
    this.status = this.$store.state.system.status;
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'ruleTable';
      const { formatter } = this.$utils;
      const { system } = this.$store.state;

      const columns = [
        { width: 40, type: 'index' },
        { title: '规则名称', field: 'name', editRender: { name: 'AInput' } },
        { title: 'Client', field: 'sourceClient', editRender: { name: 'AInput', props: { disabled: true } } },
        { title: 'Type', field: 'sourceType', editRender: { name: 'AInput', props: { disabled: true } } },
        { title: '资源', field: 'sourcePath', editRender: { name: 'AInput' } },
        { title: '资源描述', field: 'sourceDesc', editRender: { name: 'AInput', props: { disabled: true } } },
        {
          title: '参数类型',
          field: 'paramType',
          formatter: function ({ cellValue }) {
            return formatter(system.paramType, cellValue);
          },
          editRender: {
            name: 'ASelect',
            options: [
              { value: 1, label: '参数' },
              { value: 2, label: '属性' },
              { value: 3, label: '接口' }
            ]
          }
        },
        { title: '参数', field: 'parameterField', editRender: { name: 'AInput', props: { disabled: true } } },
        { title: '参数描述', field: 'parameterDesc', editRender: { name: 'AInput', props: { disabled: true } } },
        { title: 'OP', field: 'op', editRender: { name: 'AInput', props: { value: 'eq' } } },
        { title: '值', field: 'value' },
        {
          title: '状态',
          field: 'status',
          formatter: function ({ cellValue }) {
            if (cellValue === 0) {
              cellValue = '0';
            }
            return formatter(system.status, cellValue);
          },
          editRender: {
            name: 'AInput',
            field: {
              disabled: true
            }
          }
        },
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

              if (!isEdit && row.status === 0) {
                actions = [
                  <a onClick={() => this.handleCancel(options)}>删除</a>
                  // <a onClick={() => this.handleUpdate(options)}>修改</a>
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
    handleSearch (e) {
      if (e) e.preventDefault();
      const tableName = 'ruleTable';
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.system.getRulesList(params, true).then((data) => {
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
      const tableName = 'ruleTable';
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      const newData = {
        id: --this[tableName].id,
        name: ''
      };
      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
      this[tableName].editIndex = 0;
    },
    // 分页改变时
    pagerChange (change) {
      const tableName = 'ruleTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, change);
      this.handleSearch();
    },
    // 删除
    handleCancel ({ row }) {
      alert(row);
      // this.$api.series.cancelSeries(row.id).then(() => {
      //   this.handleSearch();
      // });
    },
    // 退出编辑
    handleQuitEdit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
    },
    // 搜索收起
    toggleAdvanced () {
      this.advanced = !this.advanced;
    }
  }
};
</script>
