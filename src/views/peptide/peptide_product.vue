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
                <a-select-option v-for="item in purity" :key="item.id" :value="item.id">{{ item.purity }}</a-select-option>
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
        :ref="productTable.ref"
        :columns="productTable.columns"
        :data.sync="productTable.tableData"
        :loading="productTable.loading"
        :edit-rules="productTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="productTable.pagerConfig"
        @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
        @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})"
      >
        <!-- <template slot="providerTotalAmountBegin" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:100px;"
            :class="[providerTotalAmountBegin ? '' : 'isValue']"
            v-model="providerTotalAmountBegin"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="providerTotalAmountEnd" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:100px;"
            :class="[providerTotalAmountEnd ? '' : 'isValue']"
            v-model="providerTotalAmountEnd"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="purityName" slot-scope="value, row, index">
          <a-select style="width: 65px;" size="small" v-if="editIndex === index" v-model="purityName">
            <a-select-option v-for="item in purity" :key="item.id" :value="item.purity">{{ item.purity }}</a-select-option>
          </a-select>
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoAcidLengthBegin" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:100px;"
            :class="[aminoAcidLengthBegin ? '' : 'isValue']"
            v-model="aminoAcidLengthBegin"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoAcidLengthEnd" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:100px;"
            :class="[aminoAcidLengthEnd ? '' : 'isValue']"
            v-model="aminoAcidLengthEnd"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="isNeedDesalting" slot-scope="value, row, index">
          <a-checkbox v-if="editIndex === index" @change="onChange"></a-checkbox>
          <template v-else>{{ value === 1 ? '√' :'' }}</template>
        </template>

        <template slot="aminoAcidType" slot-scope="value, row, index">
          <a-select style="width: 65px;" size="small" v-if="editIndex === index" v-model="aminoAcidType">
            <a-select-option value="L">L</a-select-option>
            <a-select-option value="D">D</a-select-option>
          </a-select>
          <template v-else>{{ value }}</template>
        </template>

        <template slot="sapProductCode" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:100px;"
            v-model="sapProductCode"
            read-only
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="sapProductName" slot-scope="value, row, index">
          <a-input-search
            size="small"
            v-if="editIndex === index"
            style="width:200px;"
            v-model="sapProductName"
            @search="openMask"
            read-only
          />
          <template v-else>{{ value }}</template>
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
    <!-- <products-mask v-show="products_status" @Closed="closeMask()" @customerData="customerData">
    </products-mask> -->
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
          purity: [
            { required: true, message: '名称必填' }
          ]
        }
      },
      products_status: '',
      purity: {}
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
    this.$api.peptide.getPurityAll({ status: 1 }).then(res => {
      this.purity = res;
    });
  },
  methods: {
    setColumns () {
      const self = this;
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { label: '编号', prop: 'code' },
        { label: '提供总量从', prop: 'providerTotalAmountBegin', editRender: { name: 'AInput' } },
        { label: '提供总量至', prop: 'providerTotalAmountEnd', editRender: { name: 'AInput' } },
        { label: '纯度', prop: 'purityName', editRender: { name: 'AInput' } },
        { label: '长度从', prop: 'aminoAcidLengthBegin', editRender: { name: 'AInput' } },
        { label: '长度至', prop: 'aminoAcidLengthEnd', editRender: { name: 'AInput' } },
        { label: '是否脱盐', prop: 'isNeedDesalting', align: 'center', editRender: { name: 'AInput' } },
        { label: '氨基酸类型', prop: 'aminoAcidType', align: 'center', editRender: { name: 'AInput' } },
        { label: '产品编号', prop: 'sapProductCode', editRender: { name: 'AInput' } },
        { label: '产品名称', prop: 'sapProductName', editRender: { name: 'AInput' } },
        { label: '状态',
          prop: 'status',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建时间', prop: 'createDate' },
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
    handleAddRow () {
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      var addVal = {
        id: --this[tableName].id,
        providerTotalAmountBegin: '',
        providerTotalAmountEnd: '',
        aminoAcidLengthBegin: '',
        aminoAcidLengthEnd: '',
        isNeedDesalting: '',
        aminoAcidType: '',
        sapProductCode: '',
        sapProductName: ''
      };
      this[tableName].tableData = [addVal, ...this[tableName].tableData];
      table.setActiveRow(addVal);
      this[tableName].editIndex = 0;
    },
    pagerChange (change) {
      this[tableName].pagerConfig[change.type] = change.value;
      this.handleSearch();
    },
    customerData (data) {
      this.sapProductCode = data[0].code;
      this.sapProductName = data[0].desc;
    },
    handleExit ({ row, rowIndex, tableName, xTable }) {
      // this.providerTotalAmountBegin = '';
      // this.providerTotalAmountEnd = '';
      // this.purityName = '';
      // this.aminoAcidLengthBegin = '';
      // this.aminoAcidLengthEnd = '';
      // this.isNeedDesalting = false;
      // this.aminoAcidType = '';
      // this.sapProductCode = '';
      // this.sapProductName = '';
      // this.$refs.table.clearActived();
      // this.$refs.table.data.splice(0, 1);
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
      if (this.providerTotalAmountBegin === '' || this.providerTotalAmountEnd === '' || this.aminoAcidLengthBegin === '' || this.aminoAcidLengthEnd === '' || this.aminoAcidType === '' || this.sapProductCode === '' || this.sapProductName === '' || this.purityName === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var purityData = [];
      this.purity.forEach((val, index, arr) => {
        if (val.purity === this.purityName) {
          purityData = val;
        }
      });
      if (r.id) {
        this.data = r;
      }
      this.data.providerTotalAmountBegin = this.providerTotalAmountBegin;
      this.data.providerTotalAmountEnd = this.providerTotalAmountEnd;
      this.data.purityName = purityData.purity;
      this.data.purityCode = purityData.code;
      this.data.purityID = purityData.id;
      this.data.aminoAcidLengthBegin = this.aminoAcidLengthBegin;
      this.data.aminoAcidLengthEnd = this.aminoAcidLengthEnd;
      this.data.isNeedDesalting = this.isNeedDesalting ? 1 : 2;
      this.data.aminoAcidType = this.aminoAcidType;
      this.data.sapProductCode = this.sapProductCode;
      this.data.sapProductName = this.sapProductName;
      this.$api.peptide.insertProduct(this.data).then(res => {
        if (res.id) {
          this.handleExit();
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

</style>
