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

          <!--          </div>-->
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div>
      <div class="table-operator">
        <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="plus" @click="addTr(12)" id="add">新增</a-button>
        <a-button type="primary" icon="edit" @click="addData">保存</a-button>
        <a-button type="primary" icon="minus-square" @click="handleDelete">删除</a-button>
        <a-button type="primary" icon="minus-square" @click="handleResume">恢复</a-button>

        <!--        <a @click="toggleAdvanced" style="margin-left: 8px">-->
        <!--          {{ advanced ? '收起' : '展开' }}-->
        <!--          <a-icon :type="advanced ? 'up' : 'down'"/>-->
        <!--        </a>-->
      </div>

      <div style="height:100%;position: relative;">
        <s-table
          style="width:65%;"
          ref="table"
          bordered
          size="small"
          :scroll="{ x: 1500, y: 500 }"
          :columns="columns"
          :data="loadData"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
        </s-table>
        <div style="width:35%;position: absolute; left:66%; top:0">
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
        </div>

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
    var self = this;
    return {
      form: this.$form.createForm(this),
      visible: false,
      advanced: true,
      aminoAcid_status: false,
      amino_acid_data: [],
      columns: [
        { title: '编号', dataIndex: 'code', width: '5%' },
        { title: '修饰名称', dataIndex: 'name', width: '18%' },
        { title: '修饰代码', dataIndex: 'modificationCode', width: '5%' },
        {
          title: '修饰位置',
          dataIndex: 'modificationPosition',
          width: '8%',
          customRender: function (value) {
            for (var i = 0; i < self.$store.state.peptide.modificationPosition.length; i++) {
              if (self.$store.state.peptide.modificationPosition[i].id === value) return self.$store.state.peptide.modificationPosition[i].name;
            }
          }
        },
        {
          title: '独立修饰',
          dataIndex: 'isIndependentModification',
          align: 'center',
          width: '6%',
          customRender: function (value) {
            if (value === 1) return '√';
          }
        },
        {
          title: '修饰类别',
          dataIndex: 'modificationTypeID',
          width: '18%',
          customRender: function (value) {
            for (var i = 0; i < self.modificationsType.length; i++) {
              if (self.modificationsType[i].id === value) {
                return self.modificationsType[i].modificationType;
              }
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '5%',
          customRender: function (value) {
            if (value === 1) {
              return '正常';
            } else if (value === 2) {
              return '已删除';
            }
          }
        },
        { title: '创建人', dataIndex: 'creatorName', width: '5%' },
        { title: '创建日期', dataIndex: 'createDate', width: '10%' },
        { title: '删除人', dataIndex: 'cancelName', width: '5%' },
        { title: '删除时间', dataIndex: 'cancelDate', width: '10%' }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getModifications(params).then(res => {
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
      },
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
      modificationsType: []
    };
  },
  watch: {
    loadDataId: function () {
      this.$refs.table1.refresh(true);
    }
  },
  mounted () {
    var selectDrop = document.getElementsByClassName('ant-checkbox')[0];
    selectDrop.style.display = 'none';
    var selectDropSon = document.getElementsByClassName('ant-checkbox')[1];
    selectDropSon.style.display = 'none';
    this.$api.peptide.getModificationTypesAll({ 'status': 1 }).then(res => {
      this.modificationsType = res;
    });
  },
  methods: {
    aminoAcidData (data) {
      this.amino_acid_data = data;
      document.getElementById('addSonValue1').value = data[0].code;
      document.getElementById('addSonValue2').value = data[0].name;
    },
    showDrawer () {
      this.visible = true;
    },
    onClose () {
      this.visible = false;
    },
    handleSearch () {
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows.slice(-1);
      this.loadDataId = this.selectedRowKeys[0];
    },
    onSelectChangeSon (selectedRowKeySon, selectedRowSon) {
      this.selectedRowKeySon = selectedRowKeySon.slice(-1);
      this.selectedRowSon = selectedRowKeySon.slice(-1);
    },
    addTr (num) {
      if (document.getElementById('addValue2')) {
        this.$notification.error({
          message: '错误',
          description: `请先保存或删除现在编辑的内容`
        });
        return false;
      }
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 2 || i === 3) {
          tdObj.style.padding = '0';
          tdObj.style.width = '100px';
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 4) {
          var expData = '';
          for (let j = 0; j < this.$store.state.peptide.modificationPosition.length; j++) {
            expData += `<option value='${this.$store.state.peptide.modificationPosition[j].id}'>${this.$store.state.peptide.modificationPosition[j].name}</option>`;
          }
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'>" + expData +
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
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'>" + expData1 +
          '</select>';
        } else {
          tdObj.style.backgroundColor = 'blue';
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
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
    handleDelete () {
      if (!document.getElementById('addValue2')) {
        if (this.selectedRowKeys[0] == null) {
          this.$notification.error({
            message: '错误',
            description: `请选择一条数据`
          });
          return false;
        }
        this.$api.peptide.deleteModifications(this.selectedRowKeys[0]).then(res => {
          this.selectedRowKeys = [];
          return this.$refs.table.refresh(true);
        });
      } else {
        this.utils.refresh();
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced;
    },
    handleResume () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeModifications(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
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
    },
    closeMask () {
      this.aminoAcid_status = false;
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
