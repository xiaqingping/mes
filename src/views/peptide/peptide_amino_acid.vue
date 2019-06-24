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
          <a-button icon="plus" @click="handleAdd">新增</a-button>
        </a-button-group>
      </div>

      <a-table
        ref="table"
        bordered
        size="small"
        rowKey="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        @change="change"
        :scroll="{ x: '2000px' }"
      >

        <template slot="name" slot-scope="value, row, index">
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
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PeptideAminoAcid',
  data () {
    return {
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      status: '',
      columns: [],
      loading: false,
      dataSource: [],
      id: 0,
      editIndex: -1,
      name: '',
      hydrophilic: '',
      hydrophobic: '',
      acidic: '',
      alkaline: '',
      isCanDisulfideBond: '',
      molecularWeight: '',
      isoelectricPoint: '',
      carboxylationDissociationConstant: '',
      aminoDissociationConstant: '',
      aminoAcidType: 'L | D',
      leftLongCode: '',
      rightLongCode: '',
      leftShortCode: '',
      rightShortCode: '',
      data: {
        'name': '',
        'hydrophilic': '',
        'hydrophobic': '',
        'acidic': '',
        'alkaline': '',
        'isCanDisulfideBond': '',
        'molecularWeight': '',
        'isoelectricPoint': '',
        'carboxylationDissociationConstant': '',
        'aminoDissociationConstant': '',
        'aminoAcidType': '',
        'longCode': '',
        'shortCode': ''
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
      this.columns = [
        { title: '编号', dataIndex: 'code' },
        { title: '名称', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
        { title: '亲水性',
          dataIndex: 'hydrophilic',
          align: 'center',
          scopedSlots: { customRender: 'hydrophilic' }
        },
        {
          title: '疏水性',
          dataIndex: 'hydrophobic',
          align: 'center',
          scopedSlots: { customRender: 'hydrophobic' }
        },
        {
          title: '酸性',
          dataIndex: 'acidic',
          align: 'center',
          scopedSlots: { customRender: 'acidic' }
        },
        {
          title: '碱性',
          dataIndex: 'alkaline',
          align: 'center',
          scopedSlots: { customRender: 'alkaline' }
        },
        {
          title: '是否可做二硫键',
          dataIndex: 'isCanDisulfideBond',
          align: 'center',
          scopedSlots: { customRender: 'isCanDisulfideBond' }
        },
        { title: '分子量', dataIndex: 'molecularWeight', align: 'center', scopedSlots: { customRender: 'molecularWeight' } },
        { title: '等电点', dataIndex: 'isoelectricPoint', align: 'center', scopedSlots: { customRender: 'isoelectricPoint' } },
        { title: '羧基解离常数', dataIndex: 'carboxylationDissociationConstant', align: 'center', scopedSlots: { customRender: 'carboxylationDissociationConstant' } },
        { title: '氨基解离常数', dataIndex: 'aminoDissociationConstant', align: 'center', scopedSlots: { customRender: 'aminoDissociationConstant' } },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text) => {
            return formatter(self.status, text);
          }
        },
        { title: '创建人', dataIndex: 'creatorName', align: 'center' },
        { title: '创建时间', dataIndex: 'createDate', align: 'center' },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' },
        { title: '类型', dataIndex: 'aminoAcidType', align: 'center', scopedSlots: { customRender: 'aminoAcidType' } },
        { title: '长代码', dataIndex: 'longCode', align: 'center', scopedSlots: { customRender: 'longCode' } },
        { title: '短代码', dataIndex: 'shortCode', align: 'center', scopedSlots: { customRender: 'shortCode' } },
        { title: '操作', width: 80, dataIndex: 'actions', fixed: 'right', scopedSlots: { customRender: 'actions' }, align: 'center' }
      ];
    },
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;
      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.current, rows: this.pagination.pageSize }, params, queryParam);
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
        this.dataSource = dest;
        this.pagination.total = dest.length * 2;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    change (pagination) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.handleSearch(params);
    },
    onChange (e, v) {
      switch (v) {
        case 'hydrophilic':
          this.hydrophilic = e.target.checked;
          break;
        case 'hydrophobic':
          this.hydrophobic = e.target.checked;
          break;
        case 'acidic':
          this.acidic = e.target.checked;
          break;
        case 'alkaline':
          this.alkaline = e.target.checked;
          break;
        case 'isCanDisulfideBond':
          this.isCanDisulfideBond = e.target.checked;
          break;
      }
    },
    handleAdd () {
      if (this.editIndex === 0) {
        return false;
      }
      this.data.id = this.id;
      this.dataSource = [ this.data, ...this.dataSource ];
      this.editIndex = 0;
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
    handleExit () {
      this.name = '';
      this.providerTotalAmountEnd = '';
      this.purityName = '';
      this.aminoAcidLengthBegin = '';
      this.aminoAcidLengthEnd = '';
      this.isNeedDesalting = false;
      this.aminoAcidType = '';
      this.sapProductCode = '';
      this.sapProductName = '';
      this.handleSearch();
    },
    handleDelete (i) {
      if (!i) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.deleteAminoAcid(i).then(res => {
        this.handleSearch();
      });
    },
    handleResume (i) {
      if (!i) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeAminoAcid(i).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
