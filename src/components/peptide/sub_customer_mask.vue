<template>
  <div v-if="hackReset" class="mask">
    <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '738px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">负责人列表</span>
        <span class="top-icon" style="padding-bottom: 10px" @click="onClose"><a-icon
          type="close"/></span>
        <span class="top-icon" @click="onSmall" v-show="small"><a-icon
          type="plus-square"/></span>
        <span class="top-icon" @click="onSmall" v-show="!small"><a-icon
          type="minus-square"/></span>
      </div>
      <div class="middle-search" style="margin: 0 3%">
        <a-form layout="inline" :form="form" @submit="handleSearch">
          <div>
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title="" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="名称">
              <a-input v-decorator="['customerName']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="电话">
              <a-input v-decorator="['charge_person']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="手机">
              <a-input v-decorator="['order']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-decorator="['saler']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="客户编号">
              <a-input v-decorator="['saler']" style="width: 163px"/>
            </a-form-item>
            <a-form-item label="客户名称">
              <a-input v-decorator="['saler']" style="width: 163px"/>
            </a-form-item>
            <a-form-item label="大区">
              <a-select v-decorator="['currency_type']" style="width: 190px;">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="网点">
              <a-select v-decorator="['commercial_network']" style="width: 190px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="币种">
              <a-input v-decorator="['saler']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="付款方式">
              <a-select v-decorator="['sales_region']" style="width: 165px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="付款条件">
              <a-select v-decorator="['sales_organization']" style="width: 163px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="销售员编号">
              <a-input v-decorator="['saler']" style="width: 148px"/>
            </a-form-item>

            <a-form-item label="销售员名称">
              <a-input v-decorator="['saler']" style="width: 148px"/>
            </a-form-item>

            <a-form-item label="销售范围">
              <a-select v-decorator="['distribution_channel']" style="width: 165px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div style="margin-bottom:10px">
            <a-button type="primary" icon="search" @click="showData">查询</a-button>
          </div>
        </a-form>

      </div>
      <s-table
        ref="table"
        bordered
        size="small"
        :scroll="{ x: 1500, y: 400}"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
      >
      </s-table>
    </div>
  </div>

</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'CustomerMask',
  // props: {
  //   customerName: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  components: {
    STable
  },
  data () {
    // var self = this;
    return {
      form: this.$form.createForm(this),
      small: true,
      customer_name_top: 0,
      customer_name_left: 0,
      rangeOrganization: [],
      rangeChannel: [],
      hackReset: true,
      status: false,
      data: false,
      columns: [
        { title: '编号', dataIndex: 'code', width: '5%' },
        { title: '公司', dataIndex: 'name', width: '8%' },
        { title: '电话', dataIndex: 'telNo', width: '7%' },
        { title: '手机', dataIndex: 'mobNo', width: '7%' },
        { title: '邮箱', dataIndex: 'email', width: '8%' },
        { title: '分类', dataIndex: 'type', width: '5%' },
        { title: '大区', dataIndex: 'regionCode', width: '5%' },
        { title: '网点', dataIndex: 'officeCode', width: '5%' },
        { title: '币种', dataIndex: 'currency', width: '4%' },
        { title: '付款方式', dataIndex: 'payMethodCode', width: '6%' },
        { title: '付款条件', dataIndex: 'payTermsCode', width: '5%' },
        { title: '销售员名称', dataIndex: 'salerName', width: '6%' },
        { title: '销售冻结(当前渠道)', dataIndex: 'customerRangeFrozen', width: '10%' },
        { title: '销售冻结(所有渠道)', dataIndex: 'customerFrozen', width: '10%' },
        { title: '客户性质', dataIndex: 'industryText', width: '5%' }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getOrder(params).then(res => {
          if (!this.data) {
            res.rows = [];
            res.total = 0;
          }
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
      },
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  mounted () {
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    if (width > 1000) {
      this.customer_name_left = (width - 1100) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 738) / 2;
    }
  },
  watch: {
    status: function () {
      if (this.status) {
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
        this.status = false;
        this.small = true;
        this.data = false;
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('Closed');
      this.status = true;
    },
    handleSearch () {
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    onSmall () {
      this.small = !this.small;
    },
    onChange (dates, dateStrings) {
      this.createDateBegin = dateStrings[0];
      this.createDateEnd = dateStrings[1];
    },
    showData () {
      this.data = true;
      this.$refs.table.refresh(true);
    }
  }
};
</script>

<style lang="scss" scoped>
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow: hidden;
  }

  .customer-name-mask {
    background: white;
    box-shadow: 2px 2px 4px gray;

    .top {
      height: 40px;
      line-height: 40px;
      margin: 0 2%;
      color: gray;

      .top-icon {
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
        float: right;
      }

      .top-icon:hover {
        color: black;
      }
    }

    .middle-search {
      .ant-row {
        margin-left: 5px;
      }
    }
  }
</style>
