<!-- 样品制备 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="vertical" :form="form" @submit.prevent="handleSearch">
        <a-row :gutter="24">
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="别名">
              <a-input v-decorator="['alias']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="系列">
              <a-select v-decorator="['seriesId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="series in $store.state.seq.series" :value="series.id" :key="series.id">{{ series.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
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
      ref="samplePrepares"
      :loading="samplePrepares.loading"
      :columns="samplePrepares.columns"
      :pager-config="samplePrepares.pagerConfig"
      :data.sync="samplePrepares.tableData"
      @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: samplePrepares, callback: handleSearch})">
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: 'SeqSamplePrepares',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      samplePrepares: {
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
      },
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.sampleprepare.getSampleprepares(params, true).then(res => {
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
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
      const tableName = 'samplePrepares';
      // const { formatter } = this.$utils;
      // const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'radio', width: 40 },
        { type: 'index', width: 40 },
        { title: '制备编号', field: 'code' },
        { title: '订单编号', field: 'orderCodes' },
        { title: '样品编号', field: 'sampleCode' },
        { title: '样品名称', field: 'sampleName' },
        { title: '状态', field: 'status' },
        { title: '制备板号', field: 'composeCode' },
        { title: '重新制备', field: 'isReprepare' },
        { title: '原制备编号', field: 'oldPrepareCode' },
        { title: '测序点', field: 'seqfactoryId' },
        { title: '反应数', field: 'reactionNumber' },
        { title: '最小长度', field: 'minSampleLength' },
        { title: '最大长度', field: 'maxSampleLength' },
        { title: '样品类型', field: 'sampleTypeId' },
        { title: '旧样重制', field: 'isOldSample' },
        { title: '样品特性', field: 'sampleFeatureName' },
        { title: '载体', field: 'carrierName' },
        { title: '抗性', field: 'sampleResistanceName' },
        { title: '制备浓度', field: 'concentration' },
        { title: '失败原因', field: 'failureReason' },
        { title: '完成人', field: 'finishName' },
        { title: '完成时间', field: 'finishDate' },
        { title: '创建时间', field: 'createDate' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;
      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'samplePrepares';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.sampleprepare.getSampleprepares(params, true).then((data) => {
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
