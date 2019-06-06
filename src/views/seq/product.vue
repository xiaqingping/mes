<template>
  <div class="page">
    <div class="page-content">

      <!-- <div class="table-search">
        <a-form layout="inline" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="取样单状态">
                <a-select v-decorator="['status']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">已删除</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="取样单编号">
                <a-input v-decorator="['code']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-button icon="search" html-type="submit" style="display:none;">查询</a-button>
        </a-form>
      </div> -->

      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="search">查询</a-button>
          <a-button icon="plus">新建</a-button>
          <a-button icon="form">删除</a-button>
          <a-button @click="getSelectedRows()">保存</a-button>
        </a-button-group>
      </div>

      <ag-grid-vue
        style="height: 500px;"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="rowData"
        rowSelection="multiple"
        @grid-ready="onGridReady"
        pagination>
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
import STable from '@/components/Table';
import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable,
    AgGridVue
  },
  data () {
    return {
      columnDefs: null,
      rowData: null,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  mounted () {
    this.createColumnDefs();
    this.search();
  },
  methods: {
    createColumnDefs () {
      this.columnDefs = [
        { headerName: 'ID', field: 'id', checkboxSelection: true },
        { headerName: 'SAP产品编号', field: 'productCode', sortable: true, filter: true },
        { headerName: 'SAP产品名称', field: 'productName' },
        { headerName: '样品类型', field: 'sampleTypeName' },
        { headerName: '测序类型', field: 'seqTypeName' },
        { headerName: '统一附加费', field: 'surcharge' },
        { headerName: '状态', field: 'status' },
        { headerName: '创建人', field: 'creatorName' },
        { headerName: '创建时间', field: 'createDate' },
        { headerName: '作废人', field: 'cancelName' },
        { headerName: '作废时间', field: 'cancelDate' }
      ];
    },
    search () {
      this.$api.sampletype.getSeqProduct().then(res => {
        this.rowData = res.rows;
      });
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    onGridReady (params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    getSelectedRows () {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      const selectedDataStringPresentation = selectedData.map(node => node.seqTypeName).join(', ');
      alert(`Selected nodes: ${selectedDataStringPresentation}`);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
