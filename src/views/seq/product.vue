<!-- 测序产品 -->
<template>
  <div class="page">
    <div class="page-content">

      <div class="table-search">
        <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
          <a-row :gutter="24">
            <a-col :md="6" :xl="4">
              <a-form-item label="状态">
                <a-select v-decorator="['status', {initialValue: 1}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xl="4">
              <a-form-item label="SAP产品编号">
                <a-input-search v-decorator="['productCode']" @search="searchProduct"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xl="4">
              <a-form-item label="样品类型">
                <a-select v-decorator="['sampleTypeId', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="status in $store.state.seq.sampleType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xl="4">
              <a-form-item label="测序类型">
                <a-select v-decorator="['seqTypeId', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="status in $store.state.seq.seqType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-button icon="search" html-type="submit" style="display:none;">查询</a-button>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button-group>
          <a-button v-action:search icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" type="primary" @click="handleAddRow()">新增</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        height="600"
        ref="productTable"
        :loading="productTable.loading"
        :columns="productTable.columns"
        :pager-config="productTable.pagerConfig"
        :data.sync="productTable.tableData"
        :edit-rules="productTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: productTable, callback: handleSearch})">
      </vxe-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeqProduct',
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      productTable: {
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
      const tableName = 'productTable';
      const { formatter } = this.$utils;
      const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { title: 'SAP产品编号', field: 'productCode' },
        { title: 'SAP产品名称', field: 'productName', editRender: { name: 'input' } },
        {
          title: '样品类型',
          field: 'sampleTypeId',
          formatter: function ({ cellValue }) { return formatter(seq.sampleType, cellValue); },
          editRender: {
            name: 'ASelect',
            options: seq.sampleType,
            optionProps: { value: 'id', label: 'name' },
            events: {
              change: ({ row, rowIndex }, value) => { this.sampleTypeChange(seq.sampleType, row, value); }
            }
          }
        },
        {
          title: '测序类型',
          field: 'seqTypeId',
          formatter: function ({ cellValue }) { return formatter(seq.seqType, cellValue); },
          editRender: {
            name: 'ASelect',
            options: seq.seqType,
            optionProps: { value: 'id', label: 'name' },
            events: {
              change: ({ row, rowIndex }, value) => { this.seqTypeChange(seq.seqType, row, value); }
            }
          }
        },
        { title: '统一附加费', field: 'surcharge', formatter: function ({ cellValue }) { return formatter(seq.surcharge, cellValue); } },
        { title: '状态', field: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { title: '创建人', field: 'creatorName' },
        { title: '创建时间', field: 'createDate' },
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

      // columns.forEach(function (e) {
      //   if (!e.width) e.width = 100;
      // });

      this[tableName].columns = columns;
      this[tableName].editRules = {
        productName: [
          { required: true, message: 'SAP产品不能为空' }
        ],
        sampleTypeId: [
          { required: true, message: '样品类型不能为空' }
        ],
        seqTypeId: [
          { required: true, message: '测序类型不能为空' }
        ]
      };

      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'productTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.sampletype.getSeqProduct(params, true).then((data) => {
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
      const tableName = 'productTable';
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
      this.$api.sampletype.cancelSeqProduct(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row, xTable }) {
      xTable.validate(row).then(() => {
        // 新增
        this.$api.sampletype.addSeqProduct(row).then(() => {
          this.handleSearch();
        });
      }).catch(err => {
        console.log(err);
      });
    },
    // 选择样品类型
    sampleTypeChange (arr, row, value) {
      let obj = {};
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === value) {
          obj = {
            sampleTypeId: arr[i].id,
            sampleTypeCode: arr[i].code,
            sampleTypeName: arr[i].name
          };
          break;
        }
      }
      row = Object.assign(row, obj);
    },
    // 选择测序类型
    seqTypeChange (arr, row, value) {
      let obj = {};
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === value) {
          obj = {
            seqTypeId: arr[i].id,
            seqTypeCode: arr[i].code,
            seqTypeName: arr[i].name
          };
          break;
        }
      }
      row = Object.assign(row, obj);
    },
    searchProduct () {

    }
  }
};
</script>

<style lang="scss" scoped>

</style>
