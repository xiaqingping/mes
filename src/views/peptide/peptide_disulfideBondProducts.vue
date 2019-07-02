<!-- 多肽二硫键产品-->
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
          <a-button icon="plus" type="primary" @click="handleAddRow" id="add">新增</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="disulfideBondProductsTable.ref"
        :columns="disulfideBondProductsTable.columns"
        :data.sync="disulfideBondProductsTable.tableData"
        :loading="disulfideBondProductsTable.loading"
        :edit-rules="disulfideBondProductsTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="disulfideBondProductsTable.pagerConfig"
        @page-change="pagerChange">
        >
      </vxe-grid>

    </div>

    <products-mask v-show="products_status" @Closed="closeMask()" @customerData="customerData">
    </products-mask>

  </div>
</template>

<script>
import ProductsMask from '@/components/peptide/products_mask';
const tableName = 'disulfideBondProductsTable';

export default {
  name: 'PeptideDisulfideBondProducts',
  components: {
    ProductsMask
  },
  data () {
    return {
      products_status: false,
      status: {}, // 状态缓存
      form: this.$form.createForm(this),
      disulfideBondProductsTable: {
        id: 0,
        ref: 'disulfideBondProductsTable',
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
      const { formatter } = this.$utils;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { title: '编号', field: 'code' },
        { title: '氨基酸类型1', field: 'aminoAcidTypeLeft', editRender: { name: 'AInput' } },
        { title: '氨基酸类型2', field: 'aminoAcidTypeRight', scopedSlots: { customRender: 'aminoAcidTypeRight' } },
        { title: '提供总量从', field: 'providerTotalAmountBegin', scopedSlots: { customRender: 'providerTotalAmountBegin' } },
        { title: '提供总量至', field: 'providerTotalAmountEnd', scopedSlots: { customRender: 'providerTotalAmountEnd' } },
        { title: '长度从', field: 'aminoAcidLengthBegin', scopedSlots: { customRender: 'aminoAcidLengthBegin' } },
        { title: '长度至', field: 'aminoAcidLengthEnd', scopedSlots: { customRender: 'aminoAcidLengthEnd' } },
        {
          title: '是否脱盐',
          field: 'isNeedDesalting',
          align: 'center',
          scopedSlots: { customRender: 'isNeedDesalting' }
        },
        { title: '产品编号', field: 'sapProductCode', scopedSlots: { customRender: 'sapProductCode' } },
        { title: '产品名称', field: 'sapProductName', scopedSlots: { customRender: 'sapProductName' } },
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

      this.$api.peptide.getdisulfideBondProducts(params).then((data) => {
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
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    customerData (data) {
      this.sapProductCode = data[0].code;
      this.sapProductName = data[0].desc;
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
    handleSave () {
      if (this.modificationName === '' || this.modificationPosition === '' || this.providerTotalAmountBegin === '' || this.providerTotalAmountEnd === '' || this.aminoAcidLengthBegin === '' || this.aminoAcidLengthEnd === '' || this.sapProductCode === '' || this.sapProductName === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      this.data.aminoAcidTypeLeft = this.aminoAcidTypeLeft;
      this.data.aminoAcidTypeRight = this.aminoAcidTypeRight;
      this.data.providerTotalAmountBegin = parseInt(this.providerTotalAmountBegin);
      this.data.providerTotalAmountEnd = parseInt(this.providerTotalAmountEnd);
      this.data.aminoAcidLengthBegin = parseInt(this.aminoAcidLengthBegin);
      this.data.aminoAcidLengthEnd = parseInt(this.aminoAcidLengthEnd);
      this.data.isNeedDesalting = this.isNeedDesalting ? 1 : 2;
      this.data.sapProductCode = this.sapProductCode;
      this.data.sapProductName = this.sapProductName;
      this.$api.peptide.insertdisulfideBondProducts(this.data).then(res => {
        if (res.id) {
          this.handleExit();
        }
      });
    },
    handleExit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
      this[tableName].editIndex = -1;
    },
    handleDelete ({ row }) {
      this.$api.peptide.deletedisulfideBondProducts(row.id).then(res => {
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
      this.$api.peptide.resumedisulfideBondProducts(row.id).then(res => {
        this.handleSearch();
      });
    }
  }

};
</script>

<style lang="scss" scoped>
</style>
