<!-- 结果分析 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
        <a-row :gutter="24">
          <a-col :md="6" :xl="4">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="别名">
              <a-input v-decorator="['alias']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="系列">
              <a-select v-decorator="['seriesId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="series in $store.state.seq.series" :value="series.id" :key="series.id">{{ series.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
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
        <a-button icon="plus" type="primary">新建</a-button>
      </a-button-group>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      height="600"
      ref="seqresultTable"
      :loading="seqresultTable.loading"
      :columns="seqresultTable.columns"
      :pager-config="seqresultTable.pagerConfig"
      :data.sync="seqresultTable.tableData"
      @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: seqresultTable, callback: handleSearch})">
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: 'SeqResult',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      seqresultTable: {
        id: 0,
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    };
  },
  mounted () {
    this.setColumn();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'seqresultTable';
      // const { formatter } = this.$utils;
      // const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'radio', width: 40 },
        { type: 'index', width: 40 },
        { title: '订单编号', field: 'orderCode' },
        { title: '样品编号', field: 'sampleCode' },
        { title: '反应编号', field: 'code' },
        { title: '反应名', field: 'reactionName' },
        { title: '样品名称', field: 'sampleName' },
        { title: '样品类型', field: 'sampleTypeId' },
        { title: '引物编号', field: 'primerCode' },
        { title: '引物名称', field: 'primerName' },
        { title: '引物类型', field: 'primerType' },
        { title: '状态', field: 'status' },
        { title: '备注', field: 'content' },
        { title: '反应板号', field: 'composeCode' },
        { title: '原反应编号', field: 'oldReactionCode' },
        { title: '项目号', field: 'orderDetailCode' },
        { title: '制备编号', field: 'samplePrepareCode' },
        { title: '制备板号', field: 'samplePrepareComposeCode' },
        { title: '测序类型', field: 'seqTypeId' },
        { title: '测序要求', field: 'seqRequire' },
        { title: '测序结果', field: 'result' },
        { title: '结果', field: 'resutlPath' },
        { title: '分析结果', field: 'targetResultPath' },
        { title: '压缩', field: 'compression' },
        { title: '优化', field: 'beautification' },
        { title: '退火温度(℃)', field: 'pcrTemperature' },
        { title: '延伸时间(sec)', field: 'pcrTime' },
        { title: '引物量', field: 'primerDose' },
        { title: '样品量', field: 'sampleDose' },
        { title: 'DMSO量', field: 'dmso' },
        { title: 'HIDI量', field: 'hidi' },
        { title: '酶3.0', field: 'enzymeZero' },
        { title: '酶3.1', field: 'enzymeOne' },
        { title: '5*Buffer', field: 'bufferFive' },
        { title: 'H2O', field: 'htoo' },
        { title: '载体', field: 'carrierName' },
        { title: '抗性', field: 'sampleResistanceName' },
        { title: '特性', field: 'sampleFeatureName' },
        { title: '最小长度', field: 'minSampleLength' },
        { title: '最大长度', field: 'maxSampleLength' },
        { title: '完成人', field: 'finishName' },
        { title: '完成时间', field: 'finishDate' },
        { title: '取消时间', field: 'cancelDate' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;
      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'seqresultTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.reaction.getSeqresults(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
