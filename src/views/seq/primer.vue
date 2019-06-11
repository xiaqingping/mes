<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="状态">
              <a-select v-decorator="['status']">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="样品类型">
              <a-select v-decorator="['sampleTypeId']">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="样品用量">
              <a-input v-decorator="['sampleDose']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="测序点">
              <a-select v-decorator="['seqfactoryIdList']">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button icon="plus">新建</a-button>
        <a-button icon="form">修改</a-button>
        <a-button icon="delete">删除</a-button>
        <a-button icon="save">保存</a-button>
      </a-button-group>
    </div>

    <s-table
      ref="table"
      bordered
      size="small"
      :scroll="{ x: 3000 }"
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
      columns: [],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.primer.getPrimer(params, true).then(res => {
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
    this.createColumnDefs();
  },
  methods: {
    createColumnDefs () {
      const { formatter } = this.$units;
      const { seq } = this.$store.state;

      this.columns = [
        { title: '编号', dataIndex: 'code' },
        { title: '名称', dataIndex: 'name' },
        { title: '状态', dataIndex: 'status', customRender: function (text, record, index) { return formatter(seq.primerStatus, text); } },
        { title: '失效原因', dataIndex: 'expireReason' },
        { title: '过期时间', dataIndex: 'overdueDate' },
        { title: '浓度', dataIndex: 'concentration' },
        { title: '类型', dataIndex: 'type' },
        { title: '序列', dataIndex: 'sequence' },
        { title: '碱基数', dataIndex: 'base' },
        { title: '测序点', dataIndex: 'seqfactoryName' },
        { title: '客户', dataIndex: 'customerName' },
        { title: '负责人', dataIndex: 'subcustomerName' },
        { title: '订货人', dataIndex: 'contactName' },
        { title: '销售员', dataIndex: 'salerName' },
        { title: '网点', dataIndex: 'officeCode' },
        { title: '大区', dataIndex: 'regionCode' },
        { title: '备注', dataIndex: 'remark' },
        { title: '合成引物SAP产品编号', dataIndex: 'primerProductCode' },
        { title: '合成引物SAP生产订单', dataIndex: 'primerProductionCode' },
        { title: 'sapDNA产品编号', dataIndex: 'sapDNAProductCode' },
        { title: 'sapCH产品编号', dataIndex: 'sapCHProductCode' },
        { title: '收样人', dataIndex: 'samplerName' },
        { title: '收样时间', dataIndex: 'samplerDate' },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '作废人', dataIndex: 'cancelName' },
        { title: '作废时间', dataIndex: 'cancelDate' }
      ];
    },
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
