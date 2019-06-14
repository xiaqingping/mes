<!-- 测序产品 -->
<template>
  <div class="page">
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
              <a-form-item label="SAP产品编号">
                <a-input-search v-decorator="['productCode']" @search="searchProduct"/>
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
              <a-form-item label="测序类型">
                <a-select v-decorator="['seqTypeId', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="status in $store.state.seq.seqType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
                </a-select>
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
          <a-button type="primary">保存</a-button>
        </a-button-group>
      </div>

      <ag-grid-vue
        style="height: 500px;"
        class="ag-theme-balham"
        :gridOptions="gridOptions"
        :columnDefs="columnDefs"
        :frameworkComponents="frameworkComponents"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        rowSelection="multiple"
        @grid-ready="onGridReady"
        @columnResized="cacheColumnState"
        @columnMoved="cacheColumnState"
        editType="fullRow"
        pagination
        resizable>
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash';
import { mapState } from 'vuex';
import STable from '@/components/Table';
import { AgGridVue } from 'ag-grid-vue';
import selectEditor from '@/components/ag-grid-editor/selectEditor';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable,
    AgGridVue
  },
  computed: mapState(['basic', 'seq']),
  data () {
    return {
      form: this.$form.createForm(this),
      agGridName: 'seq.sample_dose',
      gridApi: null,
      columnApi: null,
      // 默认列参数
      defaultColDef: {
        resizable: true,
        editable: true
      },
      // grid参数
      gridOptions: {},
      // 表格列参数
      columnDefs: null,
      // 框架组件
      frameworkComponents: {
        selectEditor
      },
      // 表格数据
      rowData: null,
      // 表单筛选参数
      queryParam: {}
    };
  },
  mounted () {
    this.createColumn();
    this.search();
  },
  methods: {
    createColumn () {
      const { formatter } = this.$units;
      const { agGridName, basic, seq } = this;

      const defalutColumn = [
        {
          headerName: 'Athlete',
          field: 'athlete',
          width: 40,
          editable: false,
          checkboxSelection: params => {
            return params.columnApi.getRowGroupColumns().length === 0;
          },
          headerCheckboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
        { headerName: 'SAP产品编号', field: 'productCode' },
        { headerName: 'SAP产品名称', field: 'productName' },
        { headerName: '样品类型',
          field: 'sampleTypeId',
          cellEditor: 'selectEditor',
          cellEditorParams: {
            list: seq.sampleType
          },
          valueFormatter: function (row) {
            return formatter(seq.sampleType, row.value);
          }
          // valueParser: function (params) {
          //   // console.log(params);
          //   return params;
          // }
        },
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
            const buttonList = [];
            if (params.data.status === 1) {
              buttonList.push('<a>删除</a>');
            }
            return buttonList.join('');
          },
          editable: false,
          pinned: 'right'
        }
      ];

      const columnDefs = [];
      const column = this.$ls.get('column') || {};
      if (column[agGridName]) {
        column[agGridName].forEach(function (e) {
          for (let i = 0; i < defalutColumn.length; i++) {
            if (defalutColumn[i].field === e.field) {
              defalutColumn[i].width = e.width;
              columnDefs.push(defalutColumn[i]);
              break;
            }
          }
        });
      }

      this.columnDefs = columnDefs;
    },
    search () {
      this.$api.sampletype.getSeqProduct({}, true).then(res => {
        this.rowData = res.rows;
      });
    },
    addRow () {
      this.gridApi.updateRowData({ add: [{ productCode: '000' }], addIndex: 0 });
    },
    searchProduct () {
      console.log('searchProduct');
    },
    onGridReady (params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    // 缓存列属性
    cacheColumnState: throttle(function () {
      const { columnApi, agGridName } = this;
      const columnState = columnApi.getColumnState();

      const arr = columnState.map(e => {
        return { field: e.colId, width: e.width };
      });

      const column = this.$ls.get('column') || {};
      column[agGridName] = arr;
      this.$ls.set('column', column);
    }, 1000)
  }
};
</script>

<style lang="scss" scoped>

</style>
