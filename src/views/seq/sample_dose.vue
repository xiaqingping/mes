<!-- 样品用量 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="样品类型">
              <a-select v-decorator="['sampleTypeId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.seq.sampleType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="样品用量">
              <a-input v-decorator="['sampleDose']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="测序点">
              <a-select v-decorator="['seqfactoryIdList', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.seq.seqfactory" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch({page: 1})">查询</a-button>
        <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
      </a-button-group>
    </div>

    <vxe-grid
      class="vxe-table-antd"
      ref="sample_dose"
      highlight-hover-row
      auto-resize
      :start-index="(pagerConfig.currentPage - 1) * pagerConfig.pageSize"
      :loading="loading"
      :columns="columns"
      :pager-config="pagerConfig"
      :data.sync="tableData"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
      @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})">
    </vxe-grid>
  </div>
</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      editIndex: -1,
      queryParam: {},
      tableData: [],
      columns: [],
      pagerConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
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
      const { formatter } = this.$units;
      const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        {
          label: '样品类型',
          prop: 'sampleTypeId',
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.sampleType
          }
        },
        { label: '最大长度', prop: 'maxSampleLength' },
        { label: '浓度', prop: 'concentration' },
        { label: '样品特性', prop: 'sampleFeatureName' },
        { label: '样品用量', prop: 'sampleDose' },
        { label: '测序点', prop: 'seqfactoryName' },
        { label: '状态', prop: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改人', prop: 'changerName' },
        { label: '修改时间', prop: 'changeDate' },
        { label: '作废人', prop: 'cancelName' },
        { label: '作废时间', prop: 'cancelDate' },
        { label: '操作',
          prop: 'actions',
          fixed: 'right',
          width: 80,
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              if (row.status === 1 && this.editIndex !== rowIndex) {
                actions = [
                  <a onClick={() => this.handleUpdate(row, rowIndex)}>修改</a>,
                  <a onClick={() => this.handleCancel(row.id)}>删除</a>
                ];
              }
              if (this.editIndex === rowIndex) {
                actions = [
                  <a>保存</a>,
                  <a>退出</a>
                ];
              }
              return [
                <span class="table-actions">
                  {actions}
                </span>
              ];
            }
          } }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this.columns = columns;
    },
    // 分页改变时
    pagerChange (change) {
      if (change.type === 'pageSize') {
        //
      }
      this.pagerConfig[change.type] = change.value;
      this.handleSearch();
    },
    // 查询
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;
      this.selectedRowKeys = [];
      this.selectedRows = [];

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagerConfig.currentPage, rows: this.pagerConfig.pageSize }, params, queryParam);

      this.$api.sampleprepare.getSampleDose(params, true).then((data) => {
        this.tableData = data.rows;
        this.pagerConfig.total = data.total;
        this.pagerConfig.currentPage = params.page;
        this.pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRow () {
      const newData = {
        id: --this.id
      };
      this.dataSource = [newData, ...this.dataSource];
      this.editIndex = 0;
    },
    // 作废
    handleCancel (id) {
      this.$api.sampleprepare.cancelSampleDose(id).then(() => {
        this.handleSearch();
      });
    },
    // 修改
    handleUpdate (row, index) {
      const table = this.$refs['sample_dose'];
      table.setActiveRow(row);
      this.editIndex = index;
    },
    /**
     * 保存
     * status字段有值代表是修改，否则是新增
     */
    handleSave (row) {
      if (row.status) {
        this.$api.sampleprepare.updateSampleDose(row).then(() => {
          this.handleSearch();
        });
      } else {
        this.$api.sampleprepare.addSampleDose(row).then(() => {
          this.handleSearch();
        });
      }
    },
    // 退出编辑
    handleQuitEdit () {
      this.editIndex = -1;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
