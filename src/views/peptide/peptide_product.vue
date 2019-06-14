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
          <div
            :key="value">
            <a-input
              size="small"
              v-if="editIndex === index"
              style="width:100px;height:21px"
              :class="[providerTotalAmountBegin ? '' : 'isValue']"
              v-model="providerTotalAmountBegin"
            />
            <template v-else>{{ value }}</template>
          </div>
        </template>

        <template slot="providerTotalAmountEnd" slot-scope="value, row, index">
          <div :key="value">
            <a-input
              size="small"
              v-if="editIndex === index"
              style="width:100px;height:21px"
              :class="[providerTotalAmountEnd ? '' : 'isValue']"
              v-model="providerTotalAmountEnd"
            />
            <template v-else>{{ value }}</template>
          </div>
        </template>

        <template slot="purityID" slot-scope="value, row, index">
          <div :key="value">
            <!-- <a-select defaultValue="lucy" style="width: 120px" v-if="editIndex === index">
              <a-select-option v-for="item in purity" :key="item.id" :value="item.id">{ item.purity}</a-select-option>
            </a-select> -->
            <a-input
              size="small"
              v-if="editIndex === index"
              style="width:100px;height:21px"
              :class="[purityID ? '' : 'isValue']"
              v-model="purityID"
            />
            <template v-else>{{ value }}</template>
          </div>
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
      columns: [],
      loading: false,
      dataSource: [],
      id: 0,
      editIndex: -1,
      purity: {},
      providerTotalAmountBegin: '',
      providerTotalAmountEnd: '',
      purityID: '',
      data: {
        'providerTotalAmountBegin': '',
        'providerTotalAmountEnd': '',
        'purityID': '',
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

      this.columns = [
        { title: '编号', dataIndex: 'code', align: 'center' },
        { title: '提供总量从', dataIndex: 'providerTotalAmountBegin', scopedSlots: { customRender: 'providerTotalAmountBegin' } },
        { title: '提供总量至', dataIndex: 'providerTotalAmountEnd', scopedSlots: { customRender: 'providerTotalAmountEnd' } },
        { title: '纯度',
          dataIndex: 'purityID',
          scopedSlots: { customRender: 'purityID' },
          customRender: function (text) {
            return formatter(self.purity, text, 'id', 'purity');
          }
        },
        { title: '长度从', dataIndex: 'aminoAcidLengthBegin' },
        { title: '长度至', dataIndex: 'aminoAcidLengthEnd' },
        { title: '是否脱盐',
          dataIndex: 'isNeedDesalting',
          align: 'center',
          width: '6%',
          customRender: function (text) {
            if (text === 1) {
              return '√';
            } else if (text === 2) {
              return '';
            }
          }
        },
        { title: '氨基酸类型', dataIndex: 'aminoAcidType', align: 'center' },
        { title: '产品编号', dataIndex: 'sapProductCode' },
        { title: '产品名称', dataIndex: 'sapProductName' },
        { title: '状态',
          dataIndex: 'status',
          customRender: function (text) {
            if (text === 1) return '正常';
            else if (text === 2) return '已删除';
          } },
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
    change (pagination) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.handleSearch(params);
    },
    customerData (data) {
      document.getElementById('addValue9').value = data[0].code;
      document.getElementById('addValue10').value = data[0].desc;
      this.utils.isValueMask(['addValue9', 'addValue10']);
    },
    showDrawer () {
      this.visible = true;
    },
    onClose () {
      this.visible = false;
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows;
    },
    addTr (num) {
      if (document.getElementById('addValue2')) {
        this.$notification.error({
          message: '错误',
          description: `请先保存或删除现在编辑的内容`
        });
        return false;
      }
      var self = this;
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 2 || i === 3 || i === 5 || i === 6) {
          tdObj.innerHTML = "<input type='text' class='isValue' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 4) {
          var expData = '';
          for (let j = 0; j < this.purity.length; j++) {
            expData += `<option value='${this.purity[j].id}'>${this.purity[j].purity}</option>`;
          }
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;outline: none;border: 1px solid grey;'>" + expData +
          '</select>';
        } else if (i === 7) {
          tdObj.style.backgroundColor = 'blue';
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='checkbox' id='addValue" + i + "'/>";
        } else if (i === 8) {
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid grey;outline: none;'><option value='L'>L</option><option value='D'>D</option></select>";
        } else if (i === 9) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' disabled id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: white;'/>";
        } else if (i === 10) {
          tdObj.innerHTML = "<div style='position: relative;width: 100%;height: 100%'><input type='text' readonly title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><span class='iconfont icon-suosou' id='openMask' style='position: absolute;right:0;top:0;cursor:pointer;font-weight:bold;color:#8C8C8C'></span></div>";
        } else {
          tdObj.style.backgroundColor = 'blue';
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
      this.$nextTick(() => {
        document.getElementById('openMask').onmouseover = function () {
          this.style.color = 'black';
        };
        document.getElementById('openMask').onmouseout = function () {
          this.style.color = '#8C8C8C';
        };
        document.getElementById('openMask').onclick = function () {
          self.openMask();
        };
        self.utils.isValue();
      });
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
      var providerTotalAmountBegin = document.getElementById('addValue2').value;
      if (providerTotalAmountBegin === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var providerTotalAmountEnd = document.getElementById('addValue3').value;
      if (providerTotalAmountEnd === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var purityID = document.getElementById('addValue4').value;
      if (purityID === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var aminoAcidLengthBegin = document.getElementById('addValue5').value;
      if (aminoAcidLengthBegin === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var aminoAcidLengthEnd = document.getElementById('addValue6').value;
      if (aminoAcidLengthEnd === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var isNeedDesalting = document.getElementById('addValue7').checked ? 1 : 2;
      var aminoAcidType = document.getElementById('addValue8').value;
      if (aminoAcidType === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
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
      var purityData = [];
      for (let i = 0; i < this.purity.length; i++) {
        if (parseInt(purityID) === parseInt(this.purity[i].id)) {
          purityData = this.purity[i];
        }
      }
      var addVal = {
        'aminoAcidLengthBegin': aminoAcidLengthBegin,
        'aminoAcidLengthEnd': aminoAcidLengthEnd,
        'aminoAcidMinimumCharge': 0,
        'aminoAcidType': aminoAcidType,
        'isNeedDesalting': isNeedDesalting,
        'providerTotalAmountBegin': providerTotalAmountBegin,
        'providerTotalAmountEnd': providerTotalAmountEnd,
        'purityCode': purityData.code,
        'purityID': purityData.id,
        'purityName': purityData.purity,
        'sapProductCode': sapProductCode,
        'sapProductName': sapProductName
      };
      this.$api.peptide.insertProduct(addVal).then(res => {
        if (res.id) {
          this.utils.refresh();
          return this.$refs.table.refresh(true);
        }
      });
    },
    handleDelete () {
      if (!document.getElementById('addValue2')) {
        if (this.selectedRowKeys[0] == null) {
          this.$notification.error({
            message: '错误',
            description: `请选择一条数据`
          });
          return false;
        }
        this.$api.peptide.deleteProduct(this.selectedRowKeys[0]).then(res => {
          this.selectedRowKeys = [];
          return this.$refs.table.refresh(true);
        });
      } else {
        this.utils.refresh();
      }
    },
    handleResume () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeProduct(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
