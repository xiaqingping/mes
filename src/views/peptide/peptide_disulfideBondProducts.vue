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
          <a-button icon="plus" @click="handleAdd" id="add">新增</a-button>
        <!-- <a-button type="primary" icon="edit" @click="addData">保存</a-button>
        <a-button type="primary" icon="minus-square" @click="handleDelete">删除</a-button>
        <a-button type="primary" icon="minus-square" @click="handleResume">恢复</a-button> -->
        </a-button-group>
      </div>

      <a-table
        ref="table"
        bordered
        size="small"
        rowKey="id"
        :dataSource="dataSource"
        :loading="loading"
        :scroll="{ x: 1700 }"
        :columns="columns"
        :pagination="pagination"
        @change="change"
      >

        <template slot="aminoAcidTypeLeft" slot-scope="value, row, index">
          <a-select style="width: 65px;" size="small" v-if="editIndex === index" v-model="aminoAcidTypeLeft">
            <a-select-option value="L">L</a-select-option>
            <a-select-option value="D">D</a-select-option>
          </a-select>
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoAcidTypeRight" slot-scope="value, row, index">
          <a-select style="width: 65px;" size="small" v-if="editIndex === index" v-model="aminoAcidTypeRight">
            <a-select-option value="L">L</a-select-option>
            <a-select-option value="D">D</a-select-option>
          </a-select>
          <template v-else>{{ value }}</template>
        </template>

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
          <div :key="value" style="position: relative;z-index:10000;opacity: 1">
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
  name: 'PeptideDisulfideBondProducts',
  components: {
    ProductsMask
  },
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      products_status: false,
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
      editIndex: -1,
      aminoAcidTypeLeft: '',
      aminoAcidTypeRight: '',
      providerTotalAmountBegin: '',
      providerTotalAmountEnd: '',
      aminoAcidLengthBegin: '',
      aminoAcidLengthEnd: '',
      isNeedDesalting: '',
      sapProductCode: '',
      sapProductName: '',
      data: {
        'aminoAcidTypeLeft': '',
        'aminoAcidTypeRight': '',
        'providerTotalAmountBegin': '',
        'providerTotalAmountEnd': '',
        'aminoAcidLengthBegin': '',
        'aminoAcidLengthEnd': '',
        'isNeedDesalting': '',
        'sapProductCode': '',
        'sapProductName': ''
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
        { title: '编号', dataIndex: 'code' },
        { title: '氨基酸类型1', dataIndex: 'aminoAcidTypeLeft', scopedSlots: { customRender: 'aminoAcidTypeLeft' } },
        { title: '氨基酸类型2', dataIndex: 'aminoAcidTypeRight', scopedSlots: { customRender: 'aminoAcidTypeRight' } },
        { title: '提供总量从', dataIndex: 'providerTotalAmountBegin', scopedSlots: { customRender: 'providerTotalAmountBegin' } },
        { title: '提供总量至', dataIndex: 'providerTotalAmountEnd', scopedSlots: { customRender: 'providerTotalAmountEnd' } },
        { title: '长度从', dataIndex: 'aminoAcidLengthBegin', scopedSlots: { customRender: 'aminoAcidLengthBegin' } },
        { title: '长度至', dataIndex: 'aminoAcidLengthEnd', scopedSlots: { customRender: 'aminoAcidLengthEnd' } },
        {
          title: '是否脱盐',
          dataIndex: 'isNeedDesalting',
          align: 'center',
          scopedSlots: { customRender: 'isNeedDesalting' }
        },
        { title: '产品编号', dataIndex: 'sapProductCode', scopedSlots: { customRender: 'sapProductCode' } },
        { title: '产品名称', dataIndex: 'sapProductName', scopedSlots: { customRender: 'sapProductName' } },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text) => {
            return formatter(self.status, text);
          }
        },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '创建日期', dataIndex: 'createDate' },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' },
        { title: '操作', width: 80, dataIndex: 'actions', fixed: 'right', scopedSlots: { customRender: 'actions' }, align: 'center' }
      ];
    },
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.current, rows: this.pagination.pageSize }, params, queryParam);

      this.$api.peptide.getdisulfideBondProducts(params).then((data) => {
        this.dataSource = data.rows;
        this.pagination.total = data.total;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    handleAdd () {
      if (this.editIndex === 0) {
        return false;
      }
      this.data.id = 0;
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
    showDrawer () {
      this.visible = true;
    },
    onClose () {
      this.visible = false;
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
    addData () {
      var aminoAcidTypeLeft = document.getElementById('addValue2').value;
      if (aminoAcidTypeLeft === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var aminoAcidTypeRight = document.getElementById('addValue3').value;
      if (aminoAcidTypeRight === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var providerTotalAmountBegin = document.getElementById('addValue4').value;
      if (providerTotalAmountBegin === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var providerTotalAmountEnd = document.getElementById('addValue5').value;
      if (providerTotalAmountEnd === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var aminoAcidLengthBegin = document.getElementById('addValue6').value;
      if (aminoAcidLengthBegin === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var aminoAcidLengthEnd = document.getElementById('addValue7').value;
      if (aminoAcidLengthEnd === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var isNeedDesalting = document.getElementById('addValue8').checked ? 1 : 2;

      var sapProductCode = document.getElementById('addValue9').value;
      if (sapProductCode === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var sapProductName = document.getElementById('addValue10').value;
      if (sapProductName === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }

      var addVal = {
        'aminoAcidTypeLeft': aminoAcidTypeLeft,
        'aminoAcidTypeRight': aminoAcidTypeRight,
        'providerTotalAmountBegin': providerTotalAmountBegin,
        'providerTotalAmountEnd': providerTotalAmountEnd,
        'aminoAcidLengthBegin': aminoAcidLengthBegin,
        'aminoAcidLengthEnd': aminoAcidLengthEnd,
        'isNeedDesalting': isNeedDesalting,
        'sapProductCode': sapProductCode,
        'sapProductName': sapProductName
      };
      this.$api.peptide.insertdisulfideBondProducts(addVal).then(res => {
        if (res.id) {
          this.utils.refresh();
          return this.$refs.table.refresh(true);
        }
      });
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
    handleExit () {
      this.aminoAcidTypeLeft = '';
      this.aminoAcidTypeRight = '';
      this.providerTotalAmountBegin = '';
      this.providerTotalAmountEnd = '';
      this.aminoAcidLengthBegin = '';
      this.aminoAcidLengthEnd = '';
      this.isNeedDesalting = '';
      this.sapProductCode = '';
      this.sapProductName = '';
      this.editIndex = -1;
      this.dataSource = this.dataSource.filter((data) => {
        return data.id;
      });
      this.handleSearch();
    },
    handleDelete (i) {
      if (i) {
        this.$api.peptide.deletedisulfideBondProducts(i).then(res => {
          this.handleSearch();
        });
      }
    },
    handleResume (i) {
      if (!i) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumedisulfideBondProducts(i).then(res => {
        this.handleSearch();
      });
    }
  }

};
</script>

<style lang="scss" scoped>
</style>
