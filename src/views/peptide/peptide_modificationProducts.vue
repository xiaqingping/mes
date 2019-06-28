<!-- 多肽修饰产品-->
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
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
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
        :ref="modificationProductTable.ref"
        :columns="modificationProductTable.columns"
        :data.sync="modificationProductTable.tableData"
        :loading="modificationProductTable.loading"
        :edit-rules="modificationProductTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="modificationProductTable.pagerConfig"
        @page-change="pagerChange">
        >
      </vxe-grid>
    </div>
    <products-mask v-show="products_status" @Closed="closeMask(1)" @customerData="customerData">
    </products-mask>

    <modifications-mask v-show="modifications_status" @Closed="closeMask(2)" @modificationsData="modificationsData">
    </modifications-mask>
  </div>
</template>

<script>
import ProductsMask from '@/components/peptide/products_mask';
import ModificationsMask from '@/components/peptide/modifications_mask';
const tableName = 'modificationProductTable';

export default {
  name: 'PeptideModificationProducts',
  components: {
    ProductsMask,
    ModificationsMask
  },
  data () {
    return {
      status: {},
      form: this.$form.createForm(this),
      aminoAcid: {},
      modificationPositionData: {},
      modificationProductTable: {
        id: 0,
        ref: 'modificationProductTable',
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
      },
      products_status: '',
      modifications_status: ''
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
    this.$api.peptide.getAminoAcid({ status: 1 }).then(res => {
      var map = {}; var dest = [];
      for (let i = 0; i < res.rows.length; i++) {
        var ai = res.rows[i];
        if (!map[ai.code]) {
          dest.push({
            id: ai.id,
            name: ai.name,
            code: ai.code
          });
          map[ai.code] = ai;
        }
      }
      this.aminoAcid = dest;
    });
  },
  methods: {
    setColumns () {
      const self = this;
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { label: '编号', prop: 'code' },
        { label: '修饰名称', prop: 'modificationName', editRender: { name: 'AInput' } },
        {
          label: '修饰位置',
          prop: 'modificationPosition',
          formatter: ({ cellValue }) => {
            if (cellValue) { return formatter(peptide.modificationPosition, cellValue); }
          }
        },
        { label: '氨基酸', prop: 'aminoAcidName', scopedSlots: { customRender: 'aminoAcidName' } },
        { label: '氨基酸类型', prop: 'aminoAcidType', scopedSlots: { customRender: 'aminoAcidType' } },
        { label: '提供总量从', prop: 'providerTotalAmountBegin', scopedSlots: { customRender: 'providerTotalAmountBegin' } },
        { label: '提供总量至', prop: 'providerTotalAmountEnd', scopedSlots: { customRender: 'providerTotalAmountEnd' } },
        { label: '长度从', prop: 'aminoAcidLengthBegin', scopedSlots: { customRender: 'aminoAcidLengthBegin' } },
        { label: '长度至', prop: 'aminoAcidLengthEnd', scopedSlots: { customRender: 'aminoAcidLengthEnd' } },
        { label: '是否脱盐',
          prop: 'isNeedDesalting',
          formatter: ({ cellValue }) => {
            if (cellValue === 1) { return '√'; }
          },
          align: 'center'
        },
        { label: '产品编号', prop: 'sapProductCode', scopedSlots: { customRender: 'sapProductCode' } },
        { label: '产品名称', prop: 'sapProductName', scopedSlots: { customRender: 'sapProductName' } },
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
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);
      this.$api.peptide.getModificationProducts(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
        this.loading = false;
      });
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
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
    customerData (data) {
      this.sapProductCode = data[0].code;
      this.sapProductName = data[0].desc;
    },
    modificationsData (data) {
      this.modificationPositionData.forEach((v) => {
        if (data[0].modificationPosition === v.id) {
          data[0].modificationPositionName = v.name;
        }
      });
      this.modifications = data;
      this.modificationName = data[0].name;
      this.modificationPosition = data[0].modificationPositionName;
    },
    openMask (num) {
      switch (num) {
        case 1 :
          this.products_status = true;
          break;
        case 2 :
          this.modifications_status = true;
          break;
      }
      document.addEventListener('mousewheel', function (e) {
        e.preventDefault();
      }, { passive: false });
    },
    closeMask (num) {
      switch (num) {
        case 1 :
          this.products_status = false;
          break;
        case 2 :
          this.modifications_status = false;
          break;
      }
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

      if (this.modifications[0].isIndependentModification === 2) {
        if (this.aminoAcidName === '' || this.aminoAcidType === '') {
          this.$notification.error({
            message: '错误',
            description: `修饰不是独立修饰，氨基酸和氨基酸类型不能为空`
          });
          return false;
        }
      }
      var aminoAcidData = [];
      for (let i = 0; i < this.aminoAcid.length; i++) {
        if (parseInt(this.aminoAcidName) === parseInt(this.aminoAcid[i].id)) {
          aminoAcidData = this.aminoAcid[i];
        }
      }
      this.data.modificationCode = this.modifications[0].code;
      this.data.modificationID = this.modifications[0].id;
      this.data.modificationName = this.modificationName;
      this.data.modificationPosition = this.modifications[0].modificationPosition;
      this.data.aminoAcidName = aminoAcidData.name;
      this.data.aminoAcidCode = aminoAcidData.code;
      this.data.aminoAcidID = aminoAcidData.id;
      this.data.aminoAcidType = this.aminoAcidType;
      this.data.aminoAcidLengthBegin = parseInt(this.aminoAcidLengthBegin);
      this.data.aminoAcidLengthEnd = parseInt(this.aminoAcidLengthEnd);
      this.data.providerTotalAmountBegin = parseInt(this.providerTotalAmountBegin);
      this.data.providerTotalAmountEnd = parseInt(this.providerTotalAmountEnd);
      this.data.isNeedDesalting = this.isNeedDesalting ? 1 : 2;
      this.data.sapProductCode = this.sapProductCode;
      this.data.sapProductName = this.sapProductName;
      this.$api.peptide.insertModificationProducts(this.data).then(res => {
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
    handleResume ({ row }) {
      if (!row.id) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeModificationProducts(row.id).then(res => {
        this.handleSearch();
      });
    },
    handleDelete ({ row }) {
      this.$api.peptide.deleteModificationProducts(row.id).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
