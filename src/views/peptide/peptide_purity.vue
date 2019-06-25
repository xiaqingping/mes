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
          <a-button icon="plus" @click="handleAdd">新增</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        ref="table"
        size="small"
        :columns="columns"
        :data.sync="dataSource"
        :loading="loading"
        :edit-rules="editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="pagination"
        @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
        @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})">
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
export default {
  name: 'PeptidePurity',
  data () {
    return {
      status: {},
      form: this.$form.createForm(this),
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [],
      loading: false,
      dataSource: [],
      editRules: {
        purity: [
          { required: true, message: '名称必填' }
        ]
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
      this.columns = [
        { type: 'index' },
        { label: '编号', prop: 'code' },
        { label: '纯度', prop: 'purity', editRender: { name: 'input' } },
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
              const xTable = this.$refs.table;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, xTable };

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
    },
    // 分页改变时
    pagerChange (change) {
      this.pagination[change.type] = change.value;
      this.handleSearch();
    },
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.currentPage, rows: this.pagination.pageSize }, params, queryParam);

      this.$api.peptide.getPurity(params).then((data) => {
        this.dataSource = data.rows;
        this.pagination.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    handleAdd () {
      var addVal = {
        id: 0,
        purity: ''
      };
      this.dataSource = [ addVal, ...this.dataSource ];
      this.$refs.table.setActiveRow(addVal);
    },
    handleSave (o) {
      if (o.row.purity === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var data = {};
      if (o.row.id) {
        data = o.row;
      }
      data.purity = o.row.purity;
      this.$api.peptide.insertPurity(data).then(res => {
        if (res.id) {
          this.handleSearch();
        }
      });
    },
    handleDelete ({ row }) {
      if (row.id) {
        this.$api.peptide.deletePurity(row.id).then(res => {
          this.handleSearch();
        });
      }
    },
    handleExit () {
      this.purity = '';
      this.$refs.table.clearActived();
      this.$refs.table.data.splice(0, 1);
    },
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
