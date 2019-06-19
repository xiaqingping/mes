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
          <a-button icon="plus" @click="handleAdd">新增</a-button>
        </a-button-group>
      </div>
      <a-table
        ref="table"
        bordered
        size="small"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="change"
        :scroll="{ x: '2000px' }"
      >
        <template slot="providerTotalAmountBegin" slot-scope="value, row, index">
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
        </template>
      </a-table>
    </div>
    <products-mask v-show="products_status" @Closed="closeMask()" @customerData="customerData">
    </products-mask>
  </div>
</template>

<script>
import ProductsMask from '@/components/peptide/products_mask';

export default {
  name: 'PeptideProduct',
  components: {
    ProductsMask
  },
  data () {
    return {
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      status: '',
      columns: [],
      loading: false,
      dataSource: [],
      id: 0,
      editIndex: -1,
      purity: {},
      providerTotalAmountBegin: '',
      providerTotalAmountEnd: '',
      purityName: '',
      aminoAcidLengthBegin: '',
      aminoAcidLengthEnd: '',
      isNeedDesalting: false,
      aminoAcidType: '',
      sapProductCode: '',
      sapProductName: '',
      data: {
        'providerTotalAmountBegin': '',
        'providerTotalAmountEnd': '',
        'purityName': '',
        'aminoAcidLengthBegin': '',
        'aminoAcidLengthEnd': '',
        'isNeedDesalting': '',
        'aminoAcidType': '',
        'sapProductCode': '',
        'sapProductName': ''
      },
      products_status: ''
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
      this.columns = [
        { title: '编号', dataIndex: 'code', align: 'center' },
        { title: '提供总量从', dataIndex: 'providerTotalAmountBegin', scopedSlots: { customRender: 'providerTotalAmountBegin' } },
        { title: '提供总量至', dataIndex: 'providerTotalAmountEnd', scopedSlots: { customRender: 'providerTotalAmountEnd' } },
        { title: '纯度', dataIndex: 'purityName', scopedSlots: { customRender: 'purityName' } },
        { title: '长度从', dataIndex: 'aminoAcidLengthBegin', scopedSlots: { customRender: 'aminoAcidLengthBegin' } },
        { title: '长度至', dataIndex: 'aminoAcidLengthEnd', scopedSlots: { customRender: 'aminoAcidLengthEnd' } },
        { title: '是否脱盐', dataIndex: 'isNeedDesalting', align: 'center', scopedSlots: { customRender: 'isNeedDesalting' } },
        { title: '氨基酸类型', dataIndex: 'aminoAcidType', align: 'center', scopedSlots: { customRender: 'aminoAcidType' } },
        { title: '产品编号', dataIndex: 'sapProductCode', scopedSlots: { customRender: 'sapProductCode' } },
        { title: '产品名称', dataIndex: 'sapProductName', scopedSlots: { customRender: 'sapProductName' } },
        { title: '状态',
          dataIndex: 'status',
          customRender: (text) => {
            return formatter(self.status, text);
          }
        },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' },
        { title: '操作', width: 80, dataIndex: 'actions', fixed: 'right', scopedSlots: { customRender: 'actions' }, align: 'center' }
      ];
    },
    handleAdd () {
      if (this.editIndex === 0) {
        return false;
      }
      this.data.id = this.id;
      this.dataSource = [ this.data, ...this.dataSource ];
      this.editIndex = 0;
    },
    onChange (e) {
      this.isNeedDesalting = e.target.checked;
    },
    change (pagination) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.handleSearch(params);
    },
    customerData (data) {
      this.sapProductCode = data[0].code;
      this.sapProductName = data[0].desc;
    },
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.current, rows: this.pagination.pageSize }, params, queryParam);

      this.$api.peptide.getProduct(params).then((data) => {
        this.dataSource = data.rows;
        this.pagination.total = data.total;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    handleExit () {
      this.providerTotalAmountBegin = '';
      this.providerTotalAmountEnd = '';
      this.purityName = '';
      this.aminoAcidLengthBegin = '';
      this.aminoAcidLengthEnd = '';
      this.isNeedDesalting = false;
      this.aminoAcidType = '';
      this.sapProductCode = '';
      this.sapProductName = '';
      this.handleSearch();
    },
    openMask () {
      this.products_status = true;
      // document.addEventListener('mousewheel', function (e) {
      //   e.preventDefault();
      // }, { passive: false });
    },
    closeMask () {
      this.products_status = false;
      // document.addEventListener('mousewheel', function (e) {
      //   e.returnValue = true;
      // }, { passive: false });
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
    handleDelete (i) {
      if (!i) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.deleteProduct(i).then(res => {
        this.handleSearch();
      });
    },
    handleResume (i) {
      if (!i) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeProduct(i).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
