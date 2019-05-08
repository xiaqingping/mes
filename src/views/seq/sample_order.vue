<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="取样单编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="取样单状态">
              <a-select v-decorator="['status']">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="备注">
                <a-input v-decorator="['remark']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="客户编号">
                <a-input v-decorator="['customerCode']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="客户名称">
                <a-input v-decorator="['customerName']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="负责人编号">
                <a-input v-decorator="['subcustomerCode']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="负责人名称">
                <a-input v-decorator="['subcustomerName']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="订货人编号">
                <a-input v-decorator="['contactCode']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="订货人名称">
                <a-input v-decorator="['contactName']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="订货人电话">
                <a-input v-decorator="['contactMobile']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="订货人邮箱">
                <a-input v-decorator="['contactEmail']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="创建日期">
                <a-date-picker v-decorator="['createDateBegin']"/>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
      <a-button type="primary" icon="plus">新建</a-button>
      <a-button type="primary" icon="form">审核</a-button>
      <a @click="toggleAdvanced" style="margin-left: 8px">
        {{ advanced ? '收起' : '展开' }}
        <a-icon :type="advanced ? 'up' : 'down'"/>
      </a>
    </div>

    <s-table
      ref="table"
      bordered
      size="small"
      :scroll="{ x: 6000 }"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
    </s-table>
  </div>
</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      advanced: true,
      columns: [
        { title: '取样单号', dataIndex: 'code' },
        { title: '转订单号', dataIndex: 'seqorderCode' },
        { title: '状态', dataIndex: 'status', customRender: function (text, record, index) { return text + 'x'; } },
        { title: '备注', dataIndex: 'remark' },
        { title: '客户', dataIndex: 'customerName' },
        { title: '负责人', dataIndex: 'subcustomerName' },
        { title: '订货人', dataIndex: 'contactName' },
        { title: '样品数', dataIndex: 'sampleNumber' },
        { title: '引物数', dataIndex: 'primerNumber' },
        { title: '订货人手机', dataIndex: 'contactMobile' },
        { title: '订货人邮箱', dataIndex: 'contactEmail' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '销售员', dataIndex: 'salerName' },
        { title: '销售员电话', dataIndex: 'salerMobile' },
        { title: '销售员邮箱', dataIndex: 'salerEmail' },
        { title: '销售渠道', dataIndex: 'rangeChannel' },
        { title: '销售组织', dataIndex: 'rangeOrganization' },
        { title: '销售大区', dataIndex: 'regionCode' },
        { title: '销售网点', dataIndex: 'officeCode' },
        { title: '收样员', dataIndex: 'samplerName' },
        { title: '收样员电话', dataIndex: 'samplerMobile' },
        { title: '收样员邮箱', dataIndex: 'samplerEmail' },
        { title: '收样网点', dataIndex: 'sampleOfficeCode' },
        { title: '取样方式', dataIndex: 'sampleMethod' },
        { title: '网点收样人', dataIndex: 'officeSamplerName' },
        { title: '网点收样时间', dataIndex: 'officeSamplerDate' },
        { title: '部门收样人', dataIndex: 'departSamplerName' },
        { title: '部门收样时间', dataIndex: 'departSamplerDate' },
        { title: '测序点', dataIndex: 'seqfactoryName' },
        { title: '地址', dataIndex: 'address' },
        { title: '预约取样时间', dataIndex: 'sampleTime' },
        { title: '标准价格', dataIndex: 'stdPrice' },
        { title: '样品返还', dataIndex: 'sampleReturn' },
        { title: '是否拼接', dataIndex: 'isSplice' },
        { title: '币种', dataIndex: 'currency' },
        { title: '开票方式', dataIndex: 'invoiceType' },
        { title: '付款条件', dataIndex: 'paymentTerm' },
        { title: '是否有明细', dataIndex: 'isDetail' },
        { title: '测序中心', dataIndex: 'factory' },
        { title: '作废原因', dataIndex: 'cancelReason' },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '确认人', dataIndex: 'toOrderName' },
        { title: '确认时间', dataIndex: 'toOrderDate' },
        { title: '修改人', dataIndex: 'changerName' },
        { title: '修改时间', dataIndex: 'changeDate' },
        { title: '作废人', dataIndex: 'cancelName' },
        { title: '作废时间', dataIndex: 'cancelDate' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.sampleorder.getOrderList(params).then(res => {
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
  mounted () {},
  methods: {
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced () {
      this.advanced = !this.advanced;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
