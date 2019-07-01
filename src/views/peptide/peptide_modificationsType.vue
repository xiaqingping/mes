<!-- 多肽类别-->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title=""/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="修饰类型 ">
              <a-input v-decorator="['modificationType']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue : '1'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">已删除</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div>
      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" type="primary" @click="handleAddRow">新增</a-button>
        </a-button-group>
      </div>
      <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="modificationsTypeTable.ref"
        :columns="modificationsTypeTable.columns"
        :data.sync="modificationsTypeTable.tableData"
        :loading="modificationsTypeTable.loading"
        :edit-rules="modificationsTypeTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="modificationsTypeTable.pagerConfig"
        @page-change="pagerChange">
        >
      </vxe-grid>
    </div>

  </div>
</template>

<script>
const tableName = 'modificationsTypeTable';
export default {
  name: 'PeptideModificationsType',
  data () {
    return {
      status: {}, // 状态缓存
      form: this.$form.createForm(this),
      modificationsTypeTable: {
        id: 0,
        ref: 'modificationsTypeTable',
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
          purity: [
            { required: true, message: '名称必填' }
          ]
        }
      }
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
  },
  methods: {
    setColumns () {
      const self = this;
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { title: '编号', field: 'code' },
        { title: '修饰类型', field: 'modificationType', editRender: { name: 'input' } },
        {
          title: '状态',
          field: 'status',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        { title: '创建人', field: 'creatorName' },
        { title: '创建日期', field: 'createDate' },
        { title: '删除人', field: 'cancelName' },
        { title: '删除时间', field: 'cancelDate' },
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

              if (!isEdit) {
                if (row.status === 1) {
                  actions = [
                    <a onClick={() => this.handleDelete(options)}>删除</a>
                  ];
                } else {
                  actions = [
                    <a onClick={() => this.handleResume(options)}>恢复</a>
                  ];
                }
              }
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleExit(options) }>退出</a>
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
      // columns.forEach(function (e) {
      //   if (!e.width) e.width = 100;
      // });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this.loading = true;
      this.editIndex = -1;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.peptide.getModificationTypes(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    handleAddRow () {
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      var addVal = {
        id: --this[tableName].id
      };
      this[tableName].tableData = [addVal, ...this[tableName].tableData];
      table.setActiveRow(addVal);
      this[tableName].editIndex = 0;
    },
    handleSave (r) {
      if (this.modificationType === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var data = {};
      if (r.id) {
        data = r;
      }
      data.modificationType = this.modificationType;
      this.$api.peptide.insertModificationTypes(data).then(res => {
        if (res.id) {
          this.handleExit();
        }
      });
    },
    handleDelete ({ row }) {
      this.$api.peptide.deleteModificationTypes(row.id).then(res => {
        this.handleSearch();
      });
    },
    handleExit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
      this[tableName].editIndex = -1;
    },
    handleResume ({ row }) {
      if (!row.id) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeModificationTypes(row.id).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
