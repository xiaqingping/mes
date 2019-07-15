<!-- 样品用量 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="vertical" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="样品类型">
              <a-select v-decorator="['sampleTypeId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.seq.sampleType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="样品用量">
              <a-input v-decorator="['sampleDose']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
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
      highlight-hover-row
      auto-resize
      height="600"
      ref="sampleDoseTable"
      :radio-config="{trigger: 'row'}"
      :loading="sampleDoseTable.loading"
      :columns="sampleDoseTable.columns"
      :pager-config="sampleDoseTable.pagerConfig"
      :data.sync="sampleDoseTable.tableData"
      :edit-rules="sampleDoseTable.editRules"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: sampleDoseTable, callback: handleSearch})">
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: 'SeqSampleOrder',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      sampleDoseTable: {
        id: 0,
        xTable: null,
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
      const tableName = 'sampleDoseTable';
      const { formatter } = this.$utils;
      const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'radio', width: 40 },
        { type: 'index', width: 40 },
        {
          title: '样品类型',
          field: 'sampleTypeId',
          formatter: function ({ cellValue }) { return formatter(seq.sampleType, cellValue); },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.sampleType
          }
        },
        { title: '最小长度', field: 'minSampleLength', editRender: { name: 'AInputNumber' } },
        { title: '最大长度', field: 'maxSampleLength', editRender: { name: 'AInputNumber' } },
        {
          title: '浓度',
          field: 'concentration',
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.concentration
          }
        },
        {
          title: '样品特性',
          field: 'sampleFeatureId',
          formatter: function ({ cellValue, row }) {
            if (!cellValue) return row.sampleFeatureName;
            return formatter(seq.sampleFeature, cellValue);
          },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.sampleFeature
          }
        },
        { title: '样品用量', field: 'sampleDose', editRender: { name: 'AInputNumber' } },
        { title: '测序点',
          field: 'seqfactoryId',
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.seqfactory
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

      this[tableName].columns = columns;
      this[tableName].editRules = {
        sampleTypeId: [
          { required: true, message: '样品类型不能为空' }
        ],
        minSampleLength: [
          { required: true, message: '最小长度不能为空' }
        ],
        maxSampleLength: [
          { required: true, message: '最大长度不能为空' }
        ],
        concentration: [
          { required: true, message: '浓度不能为空' }
        ],
        sampleFeatureId: [
          { required: true, message: '样品特性不能为空' }
        ],
        sampleDose: [
          { required: true, message: '样品用量不能为空' }
        ]
      };

      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'sampleDoseTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.sampleprepare.getSampleDose(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRow () {
      const tableName = 'sampleDoseTable';
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
      this.$api.sampleprepare.cancelSampleDose(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row, xTable }) {
      xTable.validate(row).then(() => {
        if (row.status) {
          this.$api.sampleprepare.updateSampleDose(row).then(() => {
            this.handleSearch();
          });
        } else {
          this.$api.sampleprepare.addSampleDose(row).then(() => {
            this.handleSearch();
          });
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
