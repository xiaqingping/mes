<!-- 载体 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
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
            <a-form-item label="别名">
              <a-input v-decorator="['alias']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="系列">
              <a-select v-decorator="['seriesId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="series in $store.state.seq.series" :value="series.id" :key="series.id">{{ series.name }}</a-select-option>
              </a-select>
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

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button icon="plus" type="primary">新建</a-button>
        <a-button icon="plus" type="primary" @click="validEvent">验证</a-button>
      </a-button-group>
    </div>

    <vxe-grid
      stripe
      highlight-hover-row
      border
      resizable
      auto-resize
      :ref="ref"
      :loading="loading"
      :columns="columns"
      :pager-config="pagerConfig"
      :data.sync="tableData"
      :edit-rules="editRules"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
      @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})">
      <!-- <vxe-table-column v-for="cloumn in columns" :key="cloumn.prop"></vxe-table-column> -->
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: 'SeqSampleOrder',
  components: {},
  data () {
    return {
      form: this.$form.createForm(this),
      ref: 't-carrier',
      loading: false,
      editIndex: -1,
      queryParam: {},
      tableData: [],
      columns: [],
      editRules: {},
      pagerConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted () {
    this.setColumn();
    this.setEditRules();
    this.handleSearch();
  },
  methods: {
    validEvent () {
      this.$refs['t-carrier'].validate(this.tableData[this.editIndex], valid => {
        console.log(valid);
        if (valid) {

        }
      });
    },
    // 设置表格列属性
    setColumn () {
      const { formatter } = this.$units;
      const { basic } = this.$store.state;

      const columns = [
        { width: 40, type: 'index' },
        { label: '编号',
          prop: 'code',
          slots: {
            edit: () => {
              return 321;
            }
          }
        },
        { label: '名称', prop: 'name', editRender: { name: 'AInput', props: { size: 'small' } } },
        { label: '别名', prop: 'alias', editRender: { name: 'input' } },
        { label: '系列', prop: 'seriesName', editRender: { name: 'ASelect', props: { size: 'small' }, style: 'width:100%;', options: [{ value: 1, label: 123 }] } },
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
              if (row.status === 1 && this.editIndex !== rowIndex) {
                actions = [
                  <a onClick={() => this.handleCancel(row.id)}>删除</a>,
                  <a onClick={() => this.handleUpdate(row, rowIndex)}>修改</a>
                ];
              }
              if (this.editIndex === rowIndex) {
                actions = [
                  <a>保存</a>,
                  <a onClick={() => this.handleQuitEdit(row, rowIndex)}>退出</a>
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

      this.columns = columns;
    },
    // 设置表格验证规则
    setEditRules () {
      this.editRules = {
        trigger: 'change',
        name: [
          { required: true, message: '名称不能为空' }
        ],
        alias: [
          { required: true, message: '名称不能为空' }
        ],
        seriesName: [
          { required: true, message: '系列不能为空' }
        ]
      };
    },
    // 查询
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;
      this.selectedRowKeys = [];
      this.selectedRows = [];

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagerConfig.currentPage, rows: this.pagerConfig.pageSize }, params, queryParam);

      this.$api.carrier.getCarrier(params, true).then((data) => {
        this.tableData = data.rows;
        this.pagerConfig.total = data.total;
        this.pagerConfig.currentPage = params.page;
        this.pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 作废
    handleCancel (id) {
      this.$api.carrier.cancelCarrier(id).then(() => {
        this.handleSearch();
      });
    },
    // 修改
    handleUpdate (row, index) {
      this.$refs['t-carrier'].setActiveRow(row);
      this.editIndex = index;
    },
    // 退出编辑
    handleQuitEdit (row, index) {
      this.$refs['t-carrier'].clearActived();
      this.editIndex = -1;
    },
    // 分页改变时
    pagerChange (change) {
      if (change.type === 'pageSize') {
        //
      }
      this.pagerConfig[change.type] = change.value;
      this.handleSearch();
    }

  }
};
</script>

<style lang="scss" scoped>

</style>
