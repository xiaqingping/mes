<!-- 样品用量 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="search">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="样品类型">
              <a-select v-decorator="['sampleTypeId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.seq.sampleType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
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
              <a-select v-decorator="['seqfactoryIdList', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.seq.seqfactory" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="search({page: 1})">查询</a-button>
        <a-button icon="plus" @click="addRow">新建</a-button>
        <a-button icon="form">修改</a-button>
        <a-button icon="delete">删除</a-button>
        <a-button icon="save">保存</a-button>
      </a-button-group>
    </div>

    <a-table
      ref="table"
      size="small"
      rowKey="id"
      bordered
      :scroll="{...scroll}"
      :loading="loading"
      :columns="columns"
      :pagination="pagination"
      :dataSource="dataSource"
      :rowSelection="{ type:'radio', selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :customRow="customRow"
      @change="change"
    >
      <template v-slot:sampleTypeName="slotProps">
        <div :key="text">
          <!-- <a-input
            v-if="editIndex === index"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          /> -->
          <!-- <template>{{ text }} {{ record }} {{ index }}</template> -->
          <!-- <tamplate>{{ slotProps.text }}</tamplate> -->
          <template>123</template>
        </div>
      </template>
    </a-table>
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
      scroll: { x: 1300 },
      loading: false,
      columns: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      dataSource: [],
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      id: 0,
      editIndex: 0
    };
  },
  mounted () {
    this.setColumn();
    this.search();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const { formatter } = this.$units;
      const { basic } = this.$store.state;

      this.columns = [
        { title: '样品类型', dataIndex: 'sampleTypeName' },
        { title: '最小长度', dataIndex: 'minSampleLength' },
        { title: '最大长度', dataIndex: 'maxSampleLength' },
        { title: '浓度', dataIndex: 'concentration' },
        { title: '样品特性', dataIndex: 'sampleFeatureName' },
        { title: '样品用量', dataIndex: 'sampleDose' },
        { title: '测序点', dataIndex: 'seqfactoryName' },
        { title: '状态', dataIndex: 'status', customRender: function (text, record, index) { return formatter(basic.status, text); } },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '修改人', dataIndex: 'changerName' },
        { title: '修改时间', dataIndex: 'changeDate' },
        { title: '作废人', dataIndex: 'cancelName' },
        { title: '作废时间', dataIndex: 'cancelDate' }
      ];
    },
    // 表格change事件，分页、排序、筛选变化时触发
    change (pagination, filters, sorter) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.search(params);
    },
    // 查询
    search (params = {}) {
      this.loading = true;
      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.current, rows: this.pagination.pageSize }, params, queryParam);

      this.$api.sampleprepare.getSampleDose(params).then((data) => {
        this.dataSource = data.rows;
        this.pagination.total = data.total;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 新增一行
    addRow () {
      const newData = {
        id: --this.id,
        minSampleLength: undefined
      };
      this.dataSource = [newData, ...this.dataSource];
    },
    // 行属性
    customRow (row, rowIndex) {
      return {
        on: {
          click: () => {
            // const index = this.selectedRowKeys.indexOf(row.id);
            // if (index === -1) {
            //   this.selectedRowKeys.push(row.id);
            //   this.selectedRows.push(row);
            // } else {
            //   this.selectedRowKeys.splice(index, 1);
            //   this.selectedRows = this.selectedRows.filter(function (e) {
            //     return e.id !== row.id;
            //   });
            // }
          }
        }
      };
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
