<!-- 测序反应 -->
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
      :scroll="{ x: 3500 }"
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
        return this.$api.reaction.getReaction(params, true).then(res => {
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
      const { basic } = this.$store.state;

      this.columns = [
        { title: '订单编号', dataIndex: 'orderCode' },
        { title: '样品编号', dataIndex: 'sampleCode' },
        { title: '反应编号', dataIndex: 'code' },
        { title: '反应名', dataIndex: 'reactionName' },
        { title: '样品名称', dataIndex: 'sampleName' },
        { title: '样品类型', dataIndex: 'sampleTypeId' },
        { title: '引物编号', dataIndex: 'primerCode' },
        { title: '引物名称', dataIndex: 'primerName' },
        { title: '引物类型', dataIndex: 'primerType' },
        { title: '状态', dataIndex: 'status', customRender: function (text, record, index) { return formatter(basic.status, text); } },
        { title: '备注', dataIndex: 'content' },
        { title: '反应板号', dataIndex: 'composeCode' },
        { title: '重新反应', dataIndex: 'isRepeat' },
        { title: '制备编号', dataIndex: 'samplePrepareCode' },
        { title: '制备板号', dataIndex: 'samplePrepareComposeCode' },
        { title: '测序类型', dataIndex: 'seqTypeId' },
        { title: '测序类型', dataIndex: 'seqTypeId' },
        { title: '测序点', dataIndex: 'seqfactoryId' },
        { title: '原反应编号', dataIndex: 'oldReactionCode' },
        { title: '原反应板号', dataIndex: 'oldComposeCode' },
        { title: '订单明细编号', dataIndex: 'orderDetailCode' },
        { title: '最小长度', dataIndex: 'minSampleLength' },
        { title: '最大长度', dataIndex: 'maxSampleLength' },
        { title: '重新制备', dataIndex: 'isPrepare' },
        { title: '载体', dataIndex: 'carrierName' },
        { title: '抗性', dataIndex: 'sampleResistanceName' },
        { title: '特性', dataIndex: 'sampleFeatureName' },
        { title: '测序要求', dataIndex: 'seqRequire' },
        { title: '退火温度(℃)', dataIndex: 'pcrTemperature' },
        { title: '延伸时间(sec)', dataIndex: 'pcrTime' },
        { title: '引物量', dataIndex: 'primerDose' },
        { title: '样品量', dataIndex: 'sampleDose' },
        { title: 'DMSO量', dataIndex: 'dmso' },
        { title: 'HIDI量', dataIndex: 'hidi' },
        { title: '酶3.0', dataIndex: 'enzymeZero' },
        { title: '酶3.1', dataIndex: 'enzymeOne' },
        { title: '5*Buffer', dataIndex: 'bufferFive' },
        { title: 'H2O', dataIndex: 'htoo' },
        { title: '是否旧引物', dataIndex: 'isOldPrimer' },
        { title: '取消时间', dataIndex: 'cancelDate' },
        { title: '上机人', dataIndex: 'composerName' },
        { title: '上机时间', dataIndex: 'composeDate' },
        { title: '完成人', dataIndex: 'finishName' },
        { title: '完成时间', dataIndex: 'finishDate' }
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
