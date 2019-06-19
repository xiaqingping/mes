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
          <!--                    <div v-show="advanced">-->
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="名称 ">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>

          <a-col :xxl="6" :xl="8" :md="12" :sm="24">
            <a-form-item label="修饰类型">
              <a-select v-decorator="['modificationTypeID', {initialValue : '0'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="item in modificationsType" :key="item.id" :value="item.id">
                  {{ item.modificationType }}
                </a-select-option>
              </a-select>
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

        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div>
      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" @click="handleAdd">新增</a-button>
        </a-button-group>
      </div>

      <div style="height:100%;position: relative;">
        <a-table
          ref="table"
          bordered
          size="small"
          style="width:65%"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :rowClassName="rowClassName"
          :pagination="pagination"
          :customRow="customRow"
          :scroll="{ x: 1400}"
          @change="change"
        >

          <template slot="name" slot-scope="value, row, index">
            <a-input
              size="small"
              v-if="editIndex === index"
              style="width:230px;"
              :class="[name ? '' : 'isValue']"
              v-model="name"
            />
            <template v-else>{{ value }}</template>
          </template>

          <template slot="modificationCode" slot-scope="value, row, index">
            <a-input
              size="small"
              v-if="editIndex === index"
              style="width:100px;"
              :class="[modificationCode ? '' : 'isValue']"
              v-model="modificationCode"
            />
            <template v-else>{{ value }}</template>
          </template>

          <template slot="modificationPosition" slot-scope="value, row, index">
            <a-select style="width: 80px;" size="small" v-if="editIndex === index" v-model="modificationPosition">
              <a-select-option v-for="item in modificationPositionData" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <template v-else>{{ row.modificationPositionName }}</template>
          </template>

          <template slot="isIndependentModification" slot-scope="value, row, index">
            <a-checkbox v-if="editIndex === index" @change="onChange"></a-checkbox>
            <template v-else>{{ value === 1 ? '√' :'' }}</template>
          </template>

          <template slot="modificationTypeID" slot-scope="value, row, index">
            <a-select style="width: 220px;" size="small" v-if="editIndex === index" v-model="modificationTypeID" >
              <a-select-option v-for="item in modificationsType" :key="item.id" :value="item.id">
                {{ item.modificationType }}
              </a-select-option>
            </a-select>
            <template v-else>{{ row.modificationTypeName }}</template>
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
        <div style="width:35%;position: absolute; left:66%; top:0">
          <h4>修饰适用氨基酸</h4>
          <a-button icon="plus" @click="handleAddSon">新增</a-button>
          <a-table
            v-show="advanced"
            ref="table1"
            bordered
            size="small"
            rowKey="id"
            :loading="loadingSon"
            :columns="columnSon"
            :pagination="paginationSon"
            :dataSource="dataSourceSon"
            :scroll="{ x: 800}"
            @change="changeSon"
          >
            <template slot="code" slot-scope="value, row, index">
              <a-input-search
                size="small"
                v-if="editIndexSon === index"
                style="width:100px;"
                v-model="sonCode"
                @search="openMask"
                read-only
              />
              <template v-else>{{ value }}</template>
            </template>

            <template slot="name" slot-scope="value, row, index">
              <a-input
                size="small"
                v-if="editIndexSon === index"
                style="width:100px;"
                v-model="sonName"
                read-only
              />
              <template v-else>{{ value }}</template>
            </template>

            <template slot="actions" slot-scope="value, row, index">
              <div :key="value">
                <template v-if="row.status === 1 && editIndexSon !== index">
                  <a @click="handleDeleteSon(row.id)">删除 </a>
                </template>
                <template v-if="row.status === 2 && editIndexSon !== index">
                  <a @click="handleResumeSon(row.id)">恢复</a>
                </template>
                <template v-if="editIndexSon === index">
                  <a @click="handleSaveSon(row)">保存 </a>
                  <a @click="handleExitSon()">退出 </a>
                </template>
              </div>
            </template>
          </a-table>
        </div>

      </div>

    </div>
    <amino-acid-mask v-show="aminoAcid_status" @Closed="closeMask()" @aminoAcidData="aminoAcidData">
    </amino-acid-mask>
  </div>
</template>

<script>
import AminoAcidMask from '@/components/peptide/amino_acid_mask';

export default {
  name: 'PeptideModifications',
  components: {
    AminoAcidMask
  },
  data () {
    return {
      status: {},
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      paginationSon: {
        current: 1,
        pageSize: 5,
        total: 0
      },
      columns: [],
      loading: false,
      loadingSon: false,
      dataSource: [],
      dataSourceSon: [],
      editIndex: -1,
      editIndexSon: -1,
      purity: '',
      selectRow: '',
      name: '',
      modificationCode: '',
      modificationPosition: '',
      isIndependentModification: '',
      modificationTypeID: '',
      data: {
        'name': '',
        'modificationCode': '',
        'modificationPosition': '',
        'isIndependentModification': '',
        'modificationTypeID': ''
      },
      advanced: true,
      aminoAcid_status: false,
      amino_acid_data: [],
      columnSon: [],
      modificationsType: [],
      modificationPositionData: [],
      sonCode: '',
      sonName: ''
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
    this.init();
  },
  methods: {
    init () {
      this.$api.peptide.getModificationTypes({ 'status': 1 }).then(res => {
        this.modificationsType = res.rows;
      });
    },
    onChange (e) {
      this.isIndependentModification = e.target.checked;
    },
    setColumns () {
      const self = this;
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      this.modificationPositionData = peptide.modificationPosition;
      this.columns = [
        { title: '编号', dataIndex: 'code' },
        { title: '修饰名称', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
        { title: '修饰代码', dataIndex: 'modificationCode', scopedSlots: { customRender: 'modificationCode' } },
        {
          title: '修饰位置',
          dataIndex: 'modificationPosition',
          scopedSlots: { customRender: 'modificationPosition' }
        },
        {
          title: '独立修饰',
          dataIndex: 'isIndependentModification',
          scopedSlots: { customRender: 'isIndependentModification' },
          align: 'center'
        },
        {
          title: '修饰类别',
          dataIndex: 'modificationTypeID',
          scopedSlots: { customRender: 'modificationTypeID' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (value) => {
            return formatter(self.status, value);
          }
        },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '创建日期', dataIndex: 'createDate' },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' },
        { title: '操作', width: 80, dataIndex: 'actions', fixed: 'right', scopedSlots: { customRender: 'actions' }, align: 'center' }
      ];
      this.columnSon = [
        { title: '编号', dataIndex: 'code', scopedSlots: { customRender: 'code' } },
        { title: '名称', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          customRender: function (value) {
            return formatter(self.status, value);
          }
        },
        {
          title: '创建人', dataIndex: 'creatorName', align: 'center'
        },
        {
          title: '创建时间', dataIndex: 'createDate', align: 'center'
        },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' },
        { title: '操作', width: 80, dataIndex: 'actions', fixed: 'right', scopedSlots: { customRender: 'actions' }, align: 'center' }
      ];
    },
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;
      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.current, rows: this.pagination.pageSize }, params, queryParam);

      this.$api.peptide.getModifications(params).then((data) => {
        data.rows.forEach((value, index, arr) => {
          this.modificationPositionData.forEach((v) => {
            if (value.modificationPosition === v.id) {
              data.rows[index].modificationPositionName = v.name;
            }
          });
          this.modificationsType.forEach((val) => {
            if (value.modificationTypeID === val.id) {
              data.rows[index].modificationTypeName = val.modificationType;
            }
          });
        });
        this.dataSource = data.rows;
        this.pagination.total = data.total;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSearchSon () {
      this.loadingSon = true;
      this.editIndexSon = -1;
      this.$api.peptide.getModifications({ 'id': this.selectRow }).then((data) => {
        this.dataSourceSon = data.rows[0].details;
      }).finally(() => {
        this.loadingSon = false;
      });
    },
    handleAdd () {
      if (this.editIndex === 0) {
        return false;
      }
      this.data.id = 0;
      this.dataSource = [ this.data, ...this.dataSource ];
      this.editIndex = 0;
    },
    rowClassName (record, index) {
      if (record.id) {
        return 'selectRow' + record.id;
      }
    },
    customRow (row, rowIndex) {
      return {
        on: {
          click: () => {
            if (this.selectRow) {
              document.getElementsByClassName('selectRow' + this.selectRow)[0].style.backgroundColor = 'white';
              document.getElementsByClassName('selectRow' + this.selectRow)[1].style.backgroundColor = 'white';
            }
            if (row.id === 0) {
              return false;
            }
            document.getElementsByClassName('selectRow' + row.id)[0].style.backgroundColor = 'yellow';
            document.getElementsByClassName('selectRow' + row.id)[1].style.backgroundColor = 'yellow';
            this.selectRow = row.id;
            this.dataSourceSon = row.details;
          }
        }
      };
    },
    change (pagination) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.selectRow = '';
      this.handleSearch(params);
    },
    changeSon (pagination) {
      this.paginationSon.current = pagination.current;
      this.paginationSon.pageSize = pagination.pageSize;
    },
    aminoAcidData (data) {
      this.amino_acid_data = data;
      this.sonCode = data[0].code;
      this.sonName = data[0].name;
    },
    handleSave () {
      if (this.name === '' || this.modificationCode === '' || this.modificationCode === '' || this.modificationTypeID === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      this.data.name = this.name;
      this.data.modificationCode = this.modificationCode;
      this.data.modificationPosition = this.modificationPosition;
      this.data.isIndependentModification = this.isIndependentModification ? 1 : 2;
      this.data.modificationTypeID = this.modificationTypeID;
      this.data.details = [];
      this.$api.peptide.insertModifications(this.data).then(res => {
        if (res.id) {
          this.handleExit();
        }
      });
    },
    handleDelete (i) {
      if (i) {
        this.$api.peptide.deletePurity(i).then(res => {
          this.handleSearch();
        });
      }
    },
    handleExit () {
      this.name = '';
      this.modificationCode = '';
      this.modificationPosition = '';
      this.isIndependentModification = '';
      this.modificationTypeID = '';
      this.editIndex = -1;
      this.dataSource = this.dataSource.filter((data) => {
        return data.id;
      });
    },
    handleExitSon () {
      this.sonCode = '';
      this.sonName = '';
      this.editIndexSon = -1;
      this.handleSearchSon();
      this.handleSearch();
    },
    handleSaveSon () {
      if (this.sonName === '' || this.sonCode === '' || this.selectRow === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var addSonVal = {
        'name': this.sonName,
        'code': this.sonCode,
        'aminoAcidID': this.amino_acid_data[0].id,
        'modificationID': this.selectRow
      };
      this.$api.peptide.insertSuitableAminoAcids(addSonVal).then(res => {
        if (res.id) {
          this.handleExitSon();
        }
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
      this.$api.peptide.resumePurity(i).then(res => {
        this.handleSearch();
      });
    },
    handleAddSon () {
      if (!this.selectRow) {
        return false;
      }
      alert(this.selectRow);
      if (this.editIndexSon === 0) {
        return false;
      }
      const addVal = {
        'id': 0,
        'code': '',
        'name': ''
      };
      this.dataSourceSon = [ addVal, ...this.dataSourceSon ];
      this.editIndexSon = 0;
    },
    openMask () {
      this.aminoAcid_status = true;
      // document.addEventListener('mousewheel', function (e) {
      //   e.preventDefault();
      // }, { passive: false });
    },
    closeMask () {
      this.aminoAcid_status = false;
      // document.addEventListener('mousewheel', function (e) {
      //   e.returnValue = true;
      // }, { passive: false });
    },
    handleDeleteSon (i) {
      if (i) {
        this.$api.peptide.deleteSuitableAminoAcids(i).then(res => {
          this.handleExitSon();
        });
      }
    },
    handleResumeSon (i) {
      this.$api.peptide.resumeSuitableAminoAcids(i).then(res => {
        this.handleExitSon();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
