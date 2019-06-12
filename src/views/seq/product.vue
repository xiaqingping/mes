<!-- 测序产品 -->
<template>
  <div class="page">
    <div class="page-content">

      <div class="table-search">
        <a-form layout="inline" :form="form" @submit="search">
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
      </div>

      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="search">查询</a-button>
          <a-button type="primary" icon="plus" @click="addRow()">新增</a-button>
          <a-button type="danger" icon="form">删除</a-button>
          <a-button type="primary" @click="getSelectedRows()">保存</a-button>
        </a-button-group>
      </div>

      <ag-grid-vue
        style="height: 500px;"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        rowSelection="multiple"
        @grid-ready="onGridReady"
        editType="fullRow"
        pagination
        resizable>
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
    AgGridVue,
    ActionsCell: {
      template: '<a-icon type="delete" @click="aa"></a-icon>',
      methods: {
        aa () {
          console.log(this);
        }
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      defaultColDef: {
        resizable: true,
        editable: true
      },
      gridApi: null,
      columnApi: null,
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
      const { formatter } = this.$units;
      const { basic } = this.$store.state;

      this.columnDefs = [
        {
          headerName: 'Athlete',
          field: 'athlete',
          width: 40,
          checkboxSelection: params => {
            return params.columnApi.getRowGroupColumns().length === 0;
          },
          headerCheckboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
        {
          lockPosition: true,
          valueGetter: 'node.rowIndex',
          cellClass: 'locked-col',
          width: 40,
          suppressNavigable: true,
          editable: false
        },
        { headerName: 'SAP产品编号', field: 'productCode', filter: 'agTextColumnFilter' },
        { headerName: 'SAP产品名称', field: 'productName' },
        { headerName: '样品类型', field: 'sampleTypeName' },
        { headerName: '测序类型', field: 'seqTypeName' },
        { headerName: '统一附加费', field: 'surcharge' },
        { headerName: '状态', field: 'status', valueFormatter: function (row) { return formatter(basic.status, row.value); } },
        { headerName: '创建人', field: 'creatorName' },
        { headerName: '创建时间', field: 'createDate' },
        { headerName: '作废人', field: 'cancelName' },
        { headerName: '作废时间', field: 'cancelDate' },
        { headerName: '操作',
          field: 'actions',
          cellRenderer: function (params) {
            return '<a>删除</a>';
          },
          editable: false
        }
      ];
    },
    search () {
      this.$api.sampletype.getSeqProduct().then(res => {
        this.rowData = res.rows;
      });
    },
    addRow () {
      this.gridApi.updateRowData({ add: [{ productCode: '000' }], addIndex: 0 });
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
