<!-- 测序明细报表管理 -->
<template>
  <div class="page">
    <div class="page-content">

      <div class="table-search">
        <a-form layout="vertical" :form="form" @submit.prevent="handleSearch">
          <a-row :gutter="24">
            <a-col :md="6" :lg="4" :xl="3">
              <a-form-item label="测序点">
                <a-select v-decorator="['seqfactoryId']">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in $store.state.seq.seqfactory" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :lg="8" :xl="6">
              <a-form-item label="创建日期">
                <a-range-picker
                  v-decorator="['time']"
                  :showTime="{
                    defaultValue: [$moment('00:00:00', 'HH:mm:ss'), $moment('11:59:59', 'HH:mm:ss')]
                  }"
                  format="YYYY-MM-DD" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :lg="4" :xl="3">
              <a-form-item label="样品类型">
                <a-select v-decorator="['sampleTypeId', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in $store.state.seq.sampleType" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :lg="4" :xl="3">
              <a-form-item label="引物类型">
                <a-select v-decorator="['primerTypes', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in $store.state.seq.primerType" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :lg="4" :xl="3">
              <a-form-item label="测序类型">
                <a-select v-decorator="['seqTypeId', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in $store.state.seq.seqType" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :lg="4" :xl="3">
              <a-form-item label="反应状态">
                <a-select v-decorator="['reactionStatus', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in $store.state.seq.reactionStatus" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :lg="4" :xl="3">
              <a-form-item label="销售网点">
                <a-select v-decorator="['officeCode', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in $store.state.basic.offices" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-button icon="search" html-type="submit" style="display:none;">查询</a-button>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button-group>
          <a-button v-action:search icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="file" type="primary" >导出</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        height="600"
        ref="productTable"
        :loading="productTable.loading"
        :columns="productTable.columns"
        :pager-config="productTable.pagerConfig"
        :data.sync="productTable.tableData">
      </vxe-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeqReportAnalysis',
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      productTable: {
        id: 0,
        xTable: null,
        loading: false,
        tableData: [],
        columns: []
      }
    };
  },
  mounted () {
    this.setColumn();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'productTable';
      const { formatter } = this.$utils;
      const { seq } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { title: '日期', field: 'cxDate' },
        { title: '样品类型', field: 'sampleTypeName', formatter: function ({ cellValue }) { return formatter(seq.sampleType, cellValue); } },
        { title: '反应总数', field: 'allCount' },
        { title: '次日8:00 前上传', field: 'beforeEight' },
        { title: '次日10:00 前上传', field: 'beforeTen' },
        { title: '次日12:00 前上传', field: 'beforeTwelve' },
        { title: '次日20:00 前上传', field: 'beforeTwenty' },
        { title: '次日22:00 前上传', field: 'beforeTwentyTwo' },
        { title: '次日24:00 前上传', field: 'beforeTwentyFour' },
        { title: '次日8:00 前完成率', field: 'beforeEightPercent' },
        { title: '次日10:00 前完成率', field: 'beforeTenPercent' },
        { title: '次日12:00 前完成率', field: 'beforeTwelvePercent' },
        { title: '次日20:00 前完成率', field: 'beforeTwentyPercent' },
        { title: '次日22:00 前完成率', field: 'beforeTwentyTwoPercent' },
        { title: '次日24:00 前完成率', field: 'beforeTwentyFourPercent' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 150;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'productTable';

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({}, queryParam);

      if (!params.time || !params.time.length) return this.$message.warning('请选择创建开始日期和结束日期');
      params.startTime = this.$moment(params.time[0]).format('YYYY-MM-DD');
      params.endTime = this.$moment(params.time[1]).format('YYYY-MM-DD');
      delete params.time;

      this[tableName].loading = true;
      this.$api.dataanalysis.getSeqdataanalysis(params, true).then((data) => {
        this[tableName].tableData = data.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    }
  }
};
</script>
