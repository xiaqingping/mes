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
          <a-button icon="plus" @click="handleAdd" id="add">新增</a-button>
        </a-button-group>
      </div>

      <a-table
        ref="table"
        bordered
        size="small"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :scroll="{ x: 2000}"
        @change="change"
      >
        <template slot="modificationName" slot-scope="value, row, index">
          <a-input-search
            size="small"
            v-if="editIndex === index"
            style="width:250px;"
            v-model="modificationName"
            @search="openMask(2)"
            read-only
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="modificationPosition" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:100px;"
            v-model="modificationPosition"
            read-only
          />
          <template v-else>{{ row.modificationPositionName }}</template>
        </template>

        <template slot="aminoAcidName" slot-scope="value, row, index">
          <a-select style="width: 100px;" size="small" v-if="editIndex === index" v-model="aminoAcidName">
            <a-select-option v-for="item in aminoAcid" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoAcidType" slot-scope="value, row, index">
          <a-select style="width: 50px;" size="small" v-if="editIndex === index" v-model="aminoAcidType">
            <a-select-option value="L">L</a-select-option>
            <a-select-option value="D">D</a-select-option>
          </a-select>
          <template v-else>{{ value === 'L' ? 'L' : '' }}</template>
        </template>

        <template slot="providerTotalAmountBegin" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:60px;"
            :class="[providerTotalAmountBegin ? '' : 'isValue']"
            v-model="providerTotalAmountBegin"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="providerTotalAmountEnd" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:60px;"
            :class="[providerTotalAmountEnd ? '' : 'isValue']"
            v-model="providerTotalAmountEnd"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoAcidLengthBegin" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[aminoAcidLengthBegin ? '' : 'isValue']"
            v-model="aminoAcidLengthBegin"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoAcidLengthEnd" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
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
            style="width:110px;"
            v-model="sapProductCode"
            read-only
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="sapProductName" slot-scope="value, row, index">
          <a-input-search
            size="small"
            v-if="editIndex === index"
            style="width:230px;"
            v-model="sapProductName"
            @search="openMask(1)"
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
              <a @click="handleSave()">保存 </a>
              <a @click="handleExit()">退出 </a>
            </template>
          </div>
        </template>

      </a-table>
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
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      products_status: false,
      modifications_status: false,
      columns: [],
      loading: false,
      dataSource: [],
      editIndex: -1,
      modificationName: '',
      modificationPosition: '',
      aminoAcidName: '',
      aminoAcidType: '',
      providerTotalAmountBegin: '',
      providerTotalAmountEnd: '',
      aminoAcidLengthBegin: '',
      aminoAcidLengthEnd: '',
      isNeedDesalting: '',
      sapProductCode: '',
      sapProductName: '',
      data: {
        'modificationName': '',
        'modificationPosition': '',
        'aminoAcidName': '',
        'aminoAcidType': '',
        'providerTotalAmountBegin': '',
        'providerTotalAmountEnd': '',
        'aminoAcidLengthBegin': '',
        'aminoAcidLengthEnd': '',
        'isNeedDesalting': '',
        'sapProductCode': '',
        'sapProductName': ''
      },
      modificationPositionData: [],
      selectedRows: [],
      aminoAcid: [],
      modifications: []
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
      this.modificationPositionData = peptide.modificationPosition;
      this.columns = [
        { title: '编号', dataIndex: 'code' },
        { title: '修饰名称', dataIndex: 'modificationName', scopedSlots: { customRender: 'modificationName' } },
        {
          title: '修饰位置',
          dataIndex: 'modificationPosition',
          scopedSlots: { customRender: 'modificationPosition' }
        },
        { title: '氨基酸', dataIndex: 'aminoAcidName', scopedSlots: { customRender: 'aminoAcidName' } },
        { title: '氨基酸类型', dataIndex: 'aminoAcidType', scopedSlots: { customRender: 'aminoAcidType' } },
        { title: '提供总量从', dataIndex: 'providerTotalAmountBegin', scopedSlots: { customRender: 'providerTotalAmountBegin' } },
        { title: '提供总量至', dataIndex: 'providerTotalAmountEnd', scopedSlots: { customRender: 'providerTotalAmountEnd' } },
        { title: '长度从', dataIndex: 'aminoAcidLengthBegin', scopedSlots: { customRender: 'aminoAcidLengthBegin' } },
        { title: '长度至', dataIndex: 'aminoAcidLengthEnd', scopedSlots: { customRender: 'aminoAcidLengthEnd' } },
        { title: '是否脱盐',
          dataIndex: 'isNeedDesalting',
          scopedSlots: { customRender: 'isNeedDesalting' },
          align: 'center'
        },
        { title: '产品编号', dataIndex: 'sapProductCode', scopedSlots: { customRender: 'sapProductCode' } },
        { title: '产品名称', dataIndex: 'sapProductName', scopedSlots: { customRender: 'sapProductName' } },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (value) => {
            return formatter(self.status, value);
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
      this.$api.peptide.getModificationProducts(params).then((data) => {
        data.rows.forEach((value, index, arr) => {
          this.modificationPositionData.forEach((v) => {
            if (value.modificationPosition === v.id) {
              data.rows[index].modificationPositionName = v.name;
            }
          });
        });
        this.dataSource = data.rows;
        this.pagination.total = data.total;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    change (pagination) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.handleSearch(params);
    },
    onChange (e) {
      this.isNeedDesalting = e.target.checked;
    },
    handleAdd () {
      if (this.editIndex === 0) {
        return false;
      }
      this.data.id = 0;
      this.dataSource = [ this.data, ...this.dataSource ];
      this.editIndex = 0;
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
    handleExit () {
      this.modificationName = '';
      this.modificationPosition = '';
      this.aminoAcidName = '';
      this.aminoAcidType = '';
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
    handleResume (i) {
      if (!i) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeModificationProducts(i).then(res => {
        this.handleSearch();
      });
    },
    handleDelete (i) {
      if (i) {
        this.$api.peptide.deleteModificationProducts(i).then(res => {
          this.handleSearch();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
