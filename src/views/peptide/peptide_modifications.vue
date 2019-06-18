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
            <a-select style="width: 65px;" size="small" v-if="editIndex === index" v-model="modificationPosition">
              <a-select-option v-for="item in modificationPositionData" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
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
        <!-- <div style="width:35%;position: absolute; left:66%; top:0">
          <h4>修饰适用氨基酸</h4>
          <div class="sonButton">
            <a-button type="primary" icon="plus" @click="addSonTr(8)" id="addSon">新增</a-button>
            <a-button type="primary" icon="edit" @click="addSonData">保存</a-button>
            <a-button type="primary" icon="minus-square" @click="handleSonDelete">删除</a-button>
            <a-button type="primary" icon="minus-square" @click="handleSonResume">恢复</a-button>
          </div>
          <s-table
            v-show="advanced"
            ref="table1"
            bordered
            size="small"
            :scroll="{ x: 1000, y: 500 }"
            :columns="columnSon"
            :data="loadDataSon"
            :rowSelection="{ selectedRowKeys: selectedRowKeySon, onChange: onSelectChangeSon }"
          >
          </s-table>
        </div> -->

      </div>

    </div>
    <amino-acid-mask v-show="aminoAcid_status" @Closed="closeMask()" @aminoAcidData="aminoAcidData">
    </amino-acid-mask>
  </div>
</template>

<script>
import STable from '@/components/Table';
import AminoAcidMask from '@/components/peptide/amino_acid_mask';

export default {
  name: 'PeptideModifications',
  components: {
    STable,
    AminoAcidMask
  },
  data () {
    // var self = this;
    return {
      status: {},
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      columns: [],
      loading: false,
      dataSource: [],
      editIndex: -1,
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
      columnSon: [
        { title: '编号', dataIndex: 'id', width: '10%' },
        { title: '名称', dataIndex: 'name', width: '10%' },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '10%',
          customRender: function (value) {
            return value === 1 ? '正常' : '已删除';
          }
        },
        {
          title: '创建人', dataIndex: 'creatorName', align: 'center', width: '10%'
        },
        {
          title: '创建时间', dataIndex: 'createDate', align: 'center', width: '20%'
        },
        { title: '删除人', dataIndex: 'cancelName', width: '10%' },
        { title: '删除时间', dataIndex: 'cancelDate', width: '20%' }
      ],
      queryParamSon: {},
      loadDataSon: parameter => {
        return this.$api.peptide.getModifications({ id: this.loadDataId }).then(res => {
          return {
            data: res.rows[0].details,
            page: 1,
            total: res.rows[0].details.length
          };
        });
      },
      loadDataId: 0,
      selectedRowKeys: [],
      selectedRows: [],
      selectedRowKeySon: [],
      selectedRowSon: [],
      modificationsType: [],
      modificationPositionData: []
    };
  },
  watch: {
    loadDataId: function () {
      this.$refs.table1.refresh(true);
    }
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
          scopedSlots: { customRender: 'modificationPosition' },
          customRender: (value) => {
            return formatter(peptide.modificationPosition, value);
          }
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
          // scopedSlots: { customRender: 'modificationTypeID' },
          customRender: (value) => {
            return formatter(self.modificationsType, value, 'id', 'modificationType');
          }
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
    },
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.current, rows: this.pagination.pageSize }, params, queryParam);

      this.$api.peptide.getModifications(params).then((data) => {
        this.dataSource = data.rows;
        this.pagination.total = data.total;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
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
            document.getElementsByClassName('selectRow' + row.id)[0].style.backgroundColor = 'pink';
            document.getElementsByClassName('selectRow' + row.id)[1].style.backgroundColor = 'pink';
            this.selectRow = row.id;
          }
        }
      };
    },
    change (pagination) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.handleSearch(params);
    },
    aminoAcidData (data) {
      this.amino_acid_data = data;
      document.getElementById('addSonValue1').value = data[0].code;
      document.getElementById('addSonValue2').value = data[0].name;
      this.utils.isValueMask(['addSonValue1', 'addSonValue2']);
    },
    addTr (num) {
      if (document.getElementById('addValue2')) {
        this.$notification.error({
          message: '错误',
          description: `请先保存或删除现在编辑的内容`
        });
        return false;
      }
      var self = this;
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 2 || i === 3) {
          tdObj.style.padding = '0';
          tdObj.style.width = '100px';
          tdObj.innerHTML = "<input type='text' class='isValue' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 4) {
          var expData = '';
          for (let j = 0; j < this.$store.state.peptide.modificationPosition.length; j++) {
            expData += `<option value='${this.$store.state.peptide.modificationPosition[j].id}'>${this.$store.state.peptide.modificationPosition[j].name}</option>`;
          }
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid grey;outline: none;background-color: white;'>" + expData +
          '</select>';
        } else if (i === 5) {
          tdObj.style.backgroundColor = 'blue';
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='checkbox' id='addValue" + i + "'/>";
        } else if (i === 6) {
          var expData1 = '';
          for (let j = 0; j < this.modificationsType.length; j++) {
            expData1 += `<option value='${this.modificationsType[j].id}'>${this.modificationsType[j].modificationType}</option>`;
          }
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid grey;outline: none;background-color: white;'>" + expData1 +
          '</select>';
        } else {
          tdObj.style.backgroundColor = 'blue';
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
      this.$nextTick(() => {
        self.utils.isValue();
      });
    },
    addData () {
      var name = document.getElementById('addValue2').value;
      if (name === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var modificationCode = document.getElementById('addValue3').value;
      if (modificationCode === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var modificationPosition = document.getElementById('addValue4').value;
      if (modificationPosition === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var modificationTypeID = document.getElementById('addValue6').value;
      if (modificationTypeID === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var isIndependentModification = document.getElementById('addValue5').checked ? 1 : 2;
      var addVal = {
        'name': name,
        'modificationCode': modificationCode,
        'modificationPosition': modificationPosition,
        'modificationTypeID': modificationTypeID,
        'isIndependentModification': isIndependentModification,
        'details': []
      };
      this.$api.peptide.insertModifications(addVal).then(res => {
        if (res.id) {
          this.utils.refresh();
          return this.$refs.table.refresh(true);
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
      this.purity = '';
      this.handleSearch();
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
    toggleAdvanced () {
      this.advanced = !this.advanced;
    },
    addSonTr (num) {
      var self = this;
      if (this.selectedRows.length !== 1) {
        this.$notification.error({
          message: '错误',
          description: `请先选择左侧列表的一行`
        });
        return false;
      }
      if (document.getElementById('addValue2')) {
        this.$notification.error({
          message: '错误',
          description: `请先完成左侧列表的新增`
        });
        return false;
      }
      if (this.selectedRows[0].isIndependentModification === 1) {
        this.$notification.error({
          message: '错误',
          description: `独立修饰不能添加适用氨基酸`
        });
        return false;
      }
      if (document.getElementById('addSonValue1')) {
        this.$notification.error({
          message: '错误',
          description: `请先保存或删除现在编辑的内容`
        });
        return false;
      }
      var tbodyObj = document.getElementsByTagName('tbody')[1];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 1) {
          tdObj.innerHTML = "<div style='position: relative;width: 100%;height: 100%'><input type='text' readonly title='该输入项为必输入项' id='addSonValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><span class='iconfont icon-suosou' id='openMask' style='position: absolute;right:0;top:0;cursor:pointer;font-weight:bold;color:#8C8C8C'></span></div>";
        } else if (i === 2) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' disabled id='addSonValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: white;'/>";
        } else {
          tdObj.style.backgroundColor = 'blue';
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
      this.$nextTick(() => {
        document.getElementById('openMask').onmouseover = function () {
          this.style.color = 'black';
        };
        document.getElementById('openMask').onmouseout = function () {
          this.style.color = '#8C8C8C';
        };
        document.getElementById('openMask').onclick = function () {
          self.openMask();
        };
      });
    },
    addSonData () {
      var code = document.getElementById('addSonValue1').value;
      if (code === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var name = document.getElementById('addSonValue2').value;
      if (name === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var addSonVal = {
        'name': name,
        'code': code,
        'aminoAcidID': this.amino_acid_data[0].id,
        'modificationID': this.selectedRows[0].id
      };
      this.$api.peptide.insertSuitableAminoAcids(addSonVal).then(res => {
        if (res.id) {
          var childList = document.getElementsByTagName('tbody')[1].childNodes;
          document.getElementsByTagName('tbody')[1].removeChild(childList[0]);
          document.getElementById('addSon').removeAttribute('disabled');
          return this.$refs.table1.refresh(true);
        }
      });
    },
    openMask () {
      this.aminoAcid_status = true;
      document.addEventListener('mousewheel', function (e) {
        e.preventDefault();
      }, { passive: false });
    },
    closeMask () {
      this.aminoAcid_status = false;
      document.addEventListener('mousewheel', function (e) {
        e.returnValue = true;
      }, { passive: false });
    },
    handleSonDelete () {
      if (!document.getElementById('addSonValue1')) {
        if (this.selectedRowKeySon[0] == null) {
          this.$notification.error({
            message: '错误',
            description: `请选择一条数据`
          });
          return false;
        }
        this.$api.peptide.deleteSuitableAminoAcids(this.selectedRowKeySon[0]).then(res => {
          this.selectedRowKeySon = [];
          return this.$refs.table1.refresh(true);
        });
      } else {
        var childList = document.getElementsByTagName('tbody')[1].childNodes;
        document.getElementsByTagName('tbody')[1].removeChild(childList[0]);
        document.getElementById('addSon').removeAttribute('disabled');
      }
    },
    handleSonResume () {
      if (this.selectedRowKeySon[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeSuitableAminoAcids(this.selectedRowKeySon[0]).then(res => {
        this.selectedRowKeySon = [];
        return this.$refs.table1.refresh(true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
 .sonButton {
   button {
     margin:0 5px 10px 0
   }
 }
</style>
