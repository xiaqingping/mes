<!-- 多肽合成产品-->
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
            <a-form-item label="纯度">
              <a-select v-decorator="['purityID', {initialValue : '0'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="item in $store.state.peptide.purity" :key="item.id" :value="item.id">{{ item.purity }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="类型">
              <a-select v-decorator="['aminoAcidType', {initialValue : ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="L">L</a-select-option>
                <a-select-option value="D">D</a-select-option>
              </a-select>
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
        height="570"
        :ref="productTable.ref"
        :columns="productTable.columns"
        :data.sync="productTable.tableData"
        :loading="productTable.loading"
        :edit-rules="productTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="productTable.pagerConfig"
        @page-change="pagerChange"
      >
      </vxe-grid>
    </div>
    <products-mask v-show="products_status" @Closed="closeMask()" @customerData="customerData">
    </products-mask>
  </div>
</template>

<script>
import ProductsMask from '@/components/peptide/products_mask';
const tableName = 'productTable';

export default {
  name: 'PeptideProduct',
  components: {
    ProductsMask
  },
  data () {
    return {
      status: {}, // 状态缓存
      form: this.$form.createForm(this),
      productTable: {
        id: 0,
        ref: 'productTable',
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
          providerTotalAmountBegin: [
            { required: true, message: '名称必填' }
          ],
          providerTotalAmountEnd: [
            { required: true, message: '名称必填' }
          ],
          purityID: [
            { required: true, message: '名称必填' }
          ],
          aminoAcidLengthBegin: [
            { required: true, message: '名称必填' }
          ],
          aminoAcidLengthEnd: [
            { required: true, message: '名称必填' }
          ]
        }
      },
      products_status: '',
      isNeedDesalting_status: '',
      sapProductCode: '',
      sapProductName: ''
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
  },
  methods: {
    setColumns () {
      const self = this;
      const { formatter } = this.$utils;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '提供总量从', field: 'providerTotalAmountBegin', editRender: { name: 'AInput' } },
        { title: '提供总量至', field: 'providerTotalAmountEnd', editRender: { name: 'AInput' } },
        { title: '纯度',
          field: 'purityID',
          formatter: function ({ cellValue }) { return formatter(peptide.purity, cellValue, 'id', 'purity'); },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'purity' },
            options: peptide.purity
          }
        },
        { title: '长度从', field: 'aminoAcidLengthBegin', editRender: { name: 'AInput' } },
        { title: '长度至', field: 'aminoAcidLengthEnd', editRender: { name: 'AInput' } },
        { title: '是否脱盐',
          field: 'isNeedDesalting',
          align: 'center',
          formatter: function ({ cellValue }) {
            if (cellValue === 1) { return '√'; }
          },
          editRender: { name: 'SCheckBox', events: { change: this.changeIsNeedDesalting } }
        },
        { title: '氨基酸类型',
          field: 'aminoAcidType',
          align: 'center',
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'id' },
            options: [{ id: 'L' }, { id: 'D' }]
          }
        },
        { title: '产品编号',
          field: 'sapProductCode',
          editRender: { name: 'AInput', props: { 'disabled': true } }
        },
        { title: '产品名称',
          field: 'sapProductName',
          editRender: { name: 'SInputSearch', events: { search: this.openMask } }
        },
        { title: '状态',
          field: 'status',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        { title: '创建人', field: 'creatorName' },
        { title: '创建时间', field: 'createDate' },
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
      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.peptide.getProduct(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.current = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // checkbox修改是否脱盐值
    changeIsNeedDesalting (e) {
      const table = this[tableName].xTable;
      const primer = {
        isNeedDesalting: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    handleAddRow () {
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      var addVal = {
        id: --this[tableName].id
      };

      table.insert(addVal).then(({ row }) => {
        table.setActiveRow(row);
      });
      this[tableName].editIndex = 0;
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    customerData (data) {
      const table = this[tableName].xTable;
      const primer = {
        sapProductName: data.desc,
        sapProductCode: data.code
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    handleExit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
      this[tableName].editIndex = -1;
    },
    openMask () {
      this.products_status = true;
      document.addEventListener('mousewheel', function (e) {
        e.preventDefault();
      }, { passive: false });
    },
    closeMask () {
      this.products_status = false;
      document.addEventListener('mousewheel', function (e) {
        e.returnValue = true;
      }, { passive: false });
    },
    handleSave (r) {
      // if (this.providerTotalAmountBegin === '' || this.providerTotalAmountEnd === '' || this.aminoAcidLengthBegin === '' || this.aminoAcidLengthEnd === '' || this.aminoAcidType === '' || this.sapProductCode === '' || this.sapProductName === '' || this.purityName === '') {
      //   this.$notification.error({
      //     message: '错误',
      //     description: `数据不能为空！`
      //   });
      //   return false;
      // }
      var purityData = [];
      this.$store.state.peptide.purity.forEach((val, index, arr) => {
        if (val.id === r.row.purityID) {
          purityData = val;
        }
      });
      // if (r.id) {
      //   this.data = r;
      // }
      const data = {
        providerTotalAmountBegin: r.row.providerTotalAmountBegin,
        providerTotalAmountEnd: r.row.providerTotalAmountEnd,
        purityName: purityData.purity,
        purityCode: purityData.code,
        purityID: purityData.id,
        aminoAcidLengthBegin: r.row.aminoAcidLengthBegin,
        aminoAcidLengthEnd: r.row.aminoAcidLengthEnd,
        isNeedDesalting: r.row.isNeedDesalting ? 1 : 2,
        aminoAcidType: r.row.aminoAcidType,
        sapProductCode: r.row.sapProductCode,
        sapProductName: r.row.sapProductName
      };
      this.$api.peptide.insertProduct(data).then(res => {
        if (res.id) {
          this.handleSearch();
        }
      });
    },
    handleDelete ({ row }) {
      this.$api.peptide.deleteProduct(row.id).then(res => {
        this.handleSearch();
      });
    },
    handleResume ({ row }) {
      if (!row.id) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeProduct(row.id).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
 svg:hover {
   color:black
 }
</style>
