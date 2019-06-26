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
            <a-form-item label="纯度 ">
              <a-input v-decorator="['purity']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue : 1}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="item in status" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
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
          <a-button icon="plus" @click="handleAddRow">新增</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="purityTable.ref"
        :columns="purityTable.columns"
        :data.sync="purityTable.tableData"
        :loading="purityTable.loading"
        :edit-rules="purityTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="purityTable.pagerConfig"
        @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
        @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})"
      >
        <!-- <template slot="purity" slot-scope="value, row, index">
          <div
            :key="value">
            <a-input
              size="small"
              v-if="editIndex === index"
              style="width:100px;"
              :class="[purity ? '' : 'isValue']"
              v-model="purity"
            />
            <template v-else>{{ value }}</template>
          </div>
        </template>
        <template slot="actions" slot-scope="value, row, index">
          <div :key="value">
            <template v-if="row.status === 1 && editIndex !== index">
              <a @click="handleDelete(row.id)">删除 </a>
            </template>
            <template v-if="row.status === 2 && editIndex !== index">
              <a @click="handleResume(row.id)">恢复</a>
            </template>
            <template v-if="editIndex === index">
              <a @click="handleSave(row)">保存 </a>
              <a @click="handleExit()">退出 </a>
            </template>
          </div>
        </template> -->
      </vxe-grid>
    </div>

  </div>
</template>

<script>
const tableName = 'purityTable';

export default {
  name: 'PeptidePurity',
  data () {
    return {
      status: {}, // 状态缓存
      form: this.$form.createForm(this),
      purityTable: {
        id: 0,
        ref: 'purityTable',
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
    // 初始表头
    setColumns () {
      const self = this;
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { label: '编号', prop: 'code' },
        { label: '纯度', prop: 'purity', editRender: { name: 'AInput' } },
        {
          label: '状态',
          prop: 'status',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建日期', prop: 'createDate' },
        { label: '删除人', prop: 'cancelName' },
        { label: '删除时间', prop: 'cancelDate' },
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
      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 分页
    pagerChange (change) {
      this[tableName].pagerConfig[change.type] = change.value;
      this.handleSearch();
    },
    // 搜索数据或者刷新
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.peptide.getPurity(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 增加按钮
    handleAddRow () {
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      var addVal = {
        id: --this[tableName].id,
        purity: ''
      };
      this[tableName].tableData = [addVal, ...this[tableName].tableData];
      table.setActiveRow(addVal);
      this[tableName].editIndex = 0;
    },
    // 保存功能
    handleSave (o) {
      if (o.row.purity === '') {
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
      data.purity = o.row.purity;
      this.$api.peptide.insertPurity(data).then(res => {
        if (res.id) {
          this.handleSearch();
        }
      });
    },
    // 删除功能
    handleDelete ({ row }) {
      this.$api.peptide.deletePurity(row.id).then(res => {
        this.handleSearch();
      });
    },
    // 退出功能
    handleExit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
      this[tableName].editIndex = -1;
    },
    // 恢复功能
    handleResume ({ row }) {
      if (!row.id) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumePurity(row.id).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss">

</style>
