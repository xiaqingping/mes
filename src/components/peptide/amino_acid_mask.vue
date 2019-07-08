<template>
  <div>
    <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
      <a-form-item label="编号">
        <a-input v-decorator="['code']"/>
      </a-form-item>
      <a-form-item label="名称">
        <a-input v-decorator="['name']"/>
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-decorator="['status', {initialValue : 1}]" style="width:100px">
          <a-select-option value="0">全部</a-select-option>
          <a-select-option v-for="item in $store.state.peptide.status" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
      </a-button-group>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="primerTable.ref"
      :loading="primerTable.loading"
      :columns="primerTable.columns"
      :pager-config="primerTable.pagerConfig"
      :data.sync="primerTable.tableData"
      @cell-click="(options) => handleCellClick(options)"
      @page-change="pagerChange">
    </vxe-grid>
  </div>
</template>

<script>

export default {
  name: 'PeptideAminoAcidMask',
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      primerTable: {
        ref: 'primerTable',
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
    setColumn () {
      const tableName = 'primerTable';

      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name' },
        { title: '亲水性',
          field: 'hydrophilic',
          align: 'center',
          formatter: function ({ cellValue }) { return cellValue === 1 ? '√' : ''; }
        },
        {
          title: '疏水性',
          field: 'hydrophobic',
          align: 'center',
          formatter: function ({ cellValue }) { return cellValue === 1 ? '√' : ''; }
        },
        {
          title: '酸性',
          field: 'acidic',
          align: 'center',
          formatter: function ({ cellValue }) { return cellValue === 1 ? '√' : ''; }
        },
        {
          title: '碱性',
          field: 'alkaline',
          align: 'center',
          formatter: function ({ cellValue }) { return cellValue === 1 ? '√' : ''; }
        },
        {
          title: '是否可做二硫键',
          field: 'isCanDisulfideBond',
          align: 'center',
          formatter: function ({ cellValue }) { return cellValue === 1 ? '√' : ''; }
        },
        {
          title: '分子量', field: 'molecularWeight', align: 'center'
        },
        {
          title: '等电点', field: 'isoelectricPoint', align: 'center'
        },
        {
          title: '羧基解离常数', field: 'carboxylationDissociationConstant', align: 'center'
        },
        {
          title: '氨基解离常数', field: 'aminoDissociationConstant', align: 'center'
        },
        {
          title: '状态',
          field: 'status',
          align: 'center',
          formatter: function ({ cellValue }) { return cellValue === 1 ? '正常' : '已删除'; }
        },
        {
          title: '创建人', field: 'creatorName', align: 'center'
        },
        {
          title: '创建时间', field: 'createDate', align: 'center'
        },
        { title: '删除人', field: 'cancelName' },
        { title: '删除时间', field: 'cancelDate' },
        { title: '类型', field: 'aminoAcidType', align: 'center' },
        { title: '长代码', field: 'longCode', align: 'center' },
        { title: '短代码', field: 'shortCode', align: 'center' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 110;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    handleSearch () {
      const tableName = 'primerTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.peptideBase.getAminoAcid(params).then(res => {
        var map = {}; var dest = [];
        for (let i = 0; i < res.rows.length; i++) {
          var ai = res.rows[i];
          if (!map[ai.code]) {
            dest.push({
              id: ai.id,
              code: ai.code,
              name: ai.name,
              hydrophilic: ai.hydrophilic,
              hydrophobic: ai.hydrophobic,
              acidic: ai.acidic,
              alkaline: ai.alkaline,
              isCanDisulfideBond: ai.isCanDisulfideBond,
              molecularWeight: ai.molecularWeight,
              isoelectricPoint: ai.isoelectricPoint,
              carboxylationDissociationConstant: ai.carboxylationDissociationConstant,
              aminoDissociationConstant: ai.aminoDissociationConstant,
              status: ai.status,
              creatorName: ai.creatorName,
              createDate: ai.createDate,
              cancelName: ai.cancelName,
              cancelDate: ai.cancelDate,
              aminoAcidType: ai.aminoAcidType,
              longCode: ai.longCode,
              shortCode: ai.shortCode
            });
            map[ai.code] = ai;
          } else {
            for (let j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.code === ai.code) {
                dj.shortCode = (dj.shortCode ? dj.shortCode : '') + (ai.shortCode ? ' | ' + ai.shortCode : '');
                dj.longCode = (dj.longCode ? dj.longCode : '') + (ai.longCode ? ' | ' + ai.longCode : '');
                dj.aminoAcidType = (dj.aminoAcidType ? dj.aminoAcidType : '') + (ai.aminoAcidType ? ' | ' + ai.aminoAcidType : '');
                dj.cancelDate = (dj.cancelDate ? dj.cancelDate : '') + (ai.cancelDate ? ' | ' + ai.cancelDate : '');
                dj.cancelName = (dj.cancelName ? dj.cancelName : '') + (ai.cancelName ? ' | ' + ai.cancelName : '');
                break;
              }
            }
          }
        }
        this[tableName].tableData = dest;
        this[tableName].pagerConfig.total = dest.length * 2;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    handleCellClick ({ row }) {
      this.$emit('callback', row);
    },
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'primerTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
  // .mask {
  //   position: fixed;
  //   width: 100%;
  //   height: 100%;
  //   top: 0;
  //   left: 0;
  //   background: rgba(0, 0, 0, 0.1);
  //   z-index: 10;
  //   overflow: hidden;
  // }

  // .customer-name-mask {
  //   background: white;
  //   box-shadow: 2px 2px 4px gray;

  //   .top {
  //     height: 40px;
  //     line-height: 40px;
  //     margin: 0 2%;
  //     color: gray;

  //     .top-icon {
  //       font-size: 14px;
  //       cursor: pointer;
  //       margin-left: 10px;
  //       float: right;
  //     }

  //     .top-icon:hover {
  //       color: black;
  //     }
  //   }

  //   .middle-search {
  //     .ant-row {
  //       margin-left: 5px;
  //     }
  //   }
  // }
</style>
