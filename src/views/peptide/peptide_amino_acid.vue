<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title=""/>
            </a-form-item>
          </a-col>
          <!--          <div v-show="advanced">-->
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="代码">
              <a-input v-decorator="['aminoAcidCode']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue : '1'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">已删除</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          </div>-->

        </a-row>
        <!-- <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button> -->
      </a-form>
    </div>

    <div>
      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" @click="handleAddRow">新增</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="aminoAcidTable.ref"
        :columns="aminoAcidTable.columns"
        :data.sync="aminoAcidTable.tableData"
        :loading="aminoAcidTable.loading"
        :edit-rules="aminoAcidTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="aminoAcidTable.pagerConfig"
        @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
        @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})"
      >

        <!-- <template slot="name" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:100px;"
            :class="[name ? '' : 'isValue']"
            v-model="name"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="hydrophilic" slot-scope="value, row, index">
          <a-checkbox v-if="editIndex === index" @change="onChange($event, 'hydrophilic')"></a-checkbox>
          <template v-else>{{ value === 1 ? '√' :'' }}</template>
        </template>

        <template slot="hydrophobic" slot-scope="value, row, index">
          <a-checkbox v-if="editIndex === index" @change="onChange($event, 'hydrophobic')"></a-checkbox>
          <template v-else>{{ value === 1 ? '√' :'' }}</template>
        </template>

        <template slot="acidic" slot-scope="value, row, index">
          <a-checkbox v-if="editIndex === index" @change="onChange($event, 'acidic')"></a-checkbox>
          <template v-else>{{ value === 1 ? '√' :'' }}</template>
        </template>

        <template slot="alkaline" slot-scope="value, row, index">
          <a-checkbox v-if="editIndex === index" @change="onChange($event, 'alkaline')"></a-checkbox>
          <template v-else>{{ value === 1 ? '√' :'' }}</template>
        </template>

        <template slot="isCanDisulfideBond" slot-scope="value, row, index">
          <a-checkbox v-if="editIndex === index" @change="onChange($event, 'isCanDisulfideBond')"></a-checkbox>
          <template v-else>{{ value === 1 ? '√' :'' }}</template>
        </template>

        <template slot="molecularWeight" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[molecularWeight ? '' : 'isValue']"
            v-model="molecularWeight"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="isoelectricPoint" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[isoelectricPoint ? '' : 'isValue']"
            v-model="isoelectricPoint"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="carboxylationDissociationConstant" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[carboxylationDissociationConstant ? '' : 'isValue']"
            v-model="carboxylationDissociationConstant"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoDissociationConstant" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[aminoDissociationConstant ? '' : 'isValue']"
            v-model="aminoDissociationConstant"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="aminoAcidType" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[aminoAcidType ? '' : 'isValue']"
            v-model="aminoAcidType"
            read-only
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="longCode" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[leftLongCode ? '' : 'isValue']"
            v-model="leftLongCode"
          />&nbsp;
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[rightLongCode ? '' : 'isValue']"
            v-model="rightLongCode"
          />
          <template v-else>{{ value }}</template>
        </template>

        <template slot="shortCode" slot-scope="value, row, index">
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[leftShortCode ? '' : 'isValue']"
            v-model="leftShortCode"
          />&nbsp;
          <a-input
            size="small"
            v-if="editIndex === index"
            style="width:50px;"
            :class="[rightShortCode ? '' : 'isValue']"
            v-model="rightShortCode"
          />
          <template v-else>{{ value }}</template>
        </template>
        <template slot="actions" slot-scope="value, row, index">
          <div :key="value">
            <template v-if="row.status === 1 && editIndex !== index">
              <a @click="handleDelete(row.id)">删除 </a>
            </template>
            <template v-if="row.status === 2 && editIndex !== index">
              <a @click="handleResume(row.id)">恢复</a>
            </template>
            <template v-if="editIndex === index">
              <a @click="handleSave(row)">保存 </a>
              <a @click="handleExit()">退出 </a>
            </template>
          </div>
        </template> -->
      </vxe-grid>
    </div>
  </div>
</template>

<script>
const tableName = 'aminoAcidTable';

export default {
  name: 'PeptideAminoAcid',
  data () {
    return {
      status: {}, // 状态缓存
      form: this.$form.createForm(this),
      aminoAcidTable: {
        id: 0,
        ref: 'aminoAcidTable',
        xTable: null,
        editIndex: -1,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {
          purity: [
            { required: true, message: '名称必填' }
          ]
        }
      }
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
  },
  methods: {
    setColumns () {
      const self = this;
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { label: '编号', prop: 'code' },
        { label: '名称', prop: 'name', editRender: { name: 'AInput' } },
        { label: '亲水性',
          prop: 'hydrophilic',
          align: 'center',
          scopedSlots: { customRender: 'hydrophilic' }
        },
        {
          label: '疏水性',
          prop: 'hydrophobic',
          align: 'center',
          scopedSlots: { customRender: 'hydrophobic' }
        },
        {
          label: '酸性',
          prop: 'acidic',
          align: 'center',
          scopedSlots: { customRender: 'acidic' }
        },
        {
          label: '碱性',
          prop: 'alkaline',
          align: 'center',
          scopedSlots: { customRender: 'alkaline' }
        },
        {
          label: '是否可做二硫键',
          prop: 'isCanDisulfideBond',
          align: 'center',
          formatter: ({ cellValue }) => {
            return cellValue === 1 ? '√' : '';
          }
        },
        { label: '分子量', prop: 'molecularWeight', align: 'center', scopedSlots: { customRender: 'molecularWeight' } },
        { label: '等电点', prop: 'isoelectricPoint', align: 'center', scopedSlots: { customRender: 'isoelectricPoint' } },
        { label: '羧基解离常数', prop: 'carboxylationDissociationConstant', align: 'center', scopedSlots: { customRender: 'carboxylationDissociationConstant' } },
        { label: '氨基解离常数', prop: 'aminoDissociationConstant', align: 'center', scopedSlots: { customRender: 'aminoDissociationConstant' } },
        {
          label: '状态',
          prop: 'status',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        { label: '创建人', prop: 'creatorName', align: 'center' },
        { label: '创建时间', prop: 'createDate', align: 'center' },
        { label: '删除人', prop: 'cancelName' },
        { label: '删除时间', prop: 'cancelDate' },
        { label: '类型', prop: 'aminoAcidType', align: 'center', scopedSlots: { customRender: 'aminoAcidType' } },
        { label: '长代码', prop: 'longCode', align: 'center', scopedSlots: { customRender: 'longCode' } },
        { label: '短代码', prop: 'shortCode', align: 'center', scopedSlots: { customRender: 'shortCode' } },
        {
          label: '操作',
          prop: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };

              if (!isEdit) {
                if (row.status === 1) {
                  actions = [
                    <a onClick={() => this.handleDelete(options)}>删除</a>
                  ];
                } else {
                  actions = [
                    <a onClick={() => this.handleResume(options)}>恢复</a>
                  ];
                }
              }
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleExit(options) }>退出</a>
                ];
              }
              return [
                <span class="table-actions">
                  {actions}
                </span>
              ];
            }
          }
        }
      ];
      columns.forEach(function (e) {
        if (!e.width) e.width = 120;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      this.loading = true;
      this.editIndex = -1;
      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);
      this.$api.peptide.getAminoAcid(params).then((data) => {
        var map = {}; var dest = [];
        for (let i = 0; i < data.rows.length; i++) {
          var ai = data.rows[i];
          if (!map[ai.id]) {
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
            map[ai.id] = ai;
          } else {
            for (let j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.id === ai.id) {
                dj.shortCode = (dj.shortCode ? dj.shortCode : '') + (ai.shortCode ? ' | ' + ai.shortCode : '');
                dj.longCode = (dj.longCode ? dj.longCode : '') + (ai.longCode ? ' | ' + ai.longCode : '');
                dj.aminoAcidType = (dj.aminoAcidType ? dj.aminoAcidType : '') + (ai.aminoAcidType ? ' | ' + ai.aminoAcidType : '');
                break;
              }
            }
          }
        }
        this[tableName].tableData = dest;
        this[tableName].pagerConfig.total = dest.length * 2;
        this[tableName].pagerConfig.current = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    pagerChange (change) {
      this[tableName].pagerConfig[change.type] = change.value;
      this.handleSearch();
    },
    handleAddRow () {
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      var addVal = {
        id: --this[tableName].id,
        name: '',
        hydrophilic: '',
        hydrophobic: '',
        acidic: '',
        alkaline: '',
        isCanDisulfideBond: '',
        molecularWeight: '',
        isoelectricPoint: '',
        carboxylationDissociationConstant: '',
        aminoDissociationConstant: ''
      };
      this[tableName].tableData = [addVal, ...this[tableName].tableData];
      table.setActiveRow(addVal);
      this[tableName].editIndex = 0;
    },
    handleSave (r) {
      if (this.name === '' || this.molecularWeight === '' || this.isoelectricPoint === '' || this.carboxylationDissociationConstant === '' || this.aminoDissociationConstant === '' || this.leftLongCode === '' || this.leftShortCode === '' || this.rightLongCode === '' || this.rightShortCode === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      if (r.id) {
        this.data = r;
      }
      this.data.name = this.name;
      this.data.hydrophilic = this.hydrophilic ? 1 : 0;
      this.data.hydrophobic = this.hydrophobic ? 1 : 0;
      this.data.acidic = this.acidic ? 1 : 0;
      this.data.alkaline = this.alkaline ? 1 : 0;
      this.data.isCanDisulfideBond = this.isCanDisulfideBond ? 1 : 0;
      this.data.molecularWeight = this.molecularWeight;
      this.data.isoelectricPoint = this.isoelectricPoint;
      this.data.carboxylationDissociationConstant = this.carboxylationDissociationConstant;
      this.data.aminoDissociationConstant = this.aminoDissociationConstant;
      this.data.details = [
        {
          'aminoAcidType': 'L',
          'longCode': this.leftLongCode,
          'shortCode': this.leftShortCode
        },
        {
          'aminoAcidType': 'D',
          'longCode': this.rightLongCode,
          'shortCode': this.rightShortCode
        }
      ];
      this.$api.peptide.insertAminoAcid(this.data).then(res => {
        if (res.id) {
          this.handleExit();
        }
      });
    },
    handleExit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
      this[tableName].editIndex = -1;
    },
    handleDelete ({ row }) {
      this.$api.peptide.deleteAminoAcid(row.id).then(res => {
        this.handleSearch();
      });
    },
    handleResume ({ row }) {
      if (!row.id) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeAminoAcid(row.id).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
