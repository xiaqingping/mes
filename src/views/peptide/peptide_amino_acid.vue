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
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div>
      <div class="table-operator">
        <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="plus" @click="addTr(20)" id="add">新增</a-button>
        <a-button type="primary" icon="edit" @click="addData">保存</a-button>
        <a-button type="primary" icon="minus-square" @click="handleDelete">删除</a-button>
        <a-button type="primary" icon="minus-square" @click="handleResume">恢复</a-button>
        <!--        <a @click="toggleAdvanced" style="margin-left: 8px">-->
        <!--          {{ advanced ? '收起' : '展开' }}-->
        <!--          <a-icon :type="advanced ? 'up' : 'down'"/>-->
        <!--        </a>-->
      </div>

      <s-table
        ref="table"
        bordered
        size="small"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
      </s-table>
    </div>

    <!--    <div>-->
    <!--      <div type="primary" @click="showDrawer">-->
    <!--        <div style="width: 20px;height: 100%;background-color: black">-->
    <!--          12312312312-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <a-drawer-->
    <!--        title="Basic Drawer"-->
    <!--        placement="right"-->
    <!--        :closable="false"-->
    <!--        @close="onClose"-->
    <!--        :visible="visible"-->
    <!--      >-->
    <!--        <p>Some contents...</p>-->
    <!--        <p>Some contents...</p>-->
    <!--        <p>Some contents...</p>-->
    <!--      </a-drawer>-->
    <!--    </div>-->
  </div>
</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'PeptideAminoAcid',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      // advanced: true,
      columns: [
        { title: '编号', dataIndex: 'code', width: '4%' },
        { title: '名称', dataIndex: 'name', width: '5%' },
        { title: '亲水性',
          dataIndex: 'hydrophilic',
          align: 'center',
          width: '4%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '疏水性',
          dataIndex: 'hydrophobic',
          align: 'center',
          width: '4%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '酸性',
          dataIndex: 'acidic',
          align: 'center',
          width: '3%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '碱性',
          dataIndex: 'alkaline',
          align: 'center',
          width: '3%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '是否可做二硫键',
          dataIndex: 'isCanDisulfideBond',
          align: 'center',
          width: '8%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '分子量', dataIndex: 'molecularWeight', align: 'center', width: '4%'
        },
        {
          title: '等电点', dataIndex: 'isoelectricPoint', align: 'center', width: '4%'
        },
        {
          title: '羧基解离常数', dataIndex: 'carboxylationDissociationConstant', align: 'center', width: '8%'
        },
        {
          title: '氨基解离常数', dataIndex: 'aminoDissociationConstant', align: 'center', width: '8%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '3%',
          customRender: function (value) {
            return value === 1 ? '正常' : '已删除';
          }
        },
        {
          title: '创建人', dataIndex: 'creatorName', align: 'center', width: '4%'
        },
        {
          title: '创建时间', dataIndex: 'createDate', align: 'center', width: '6%'
        },
        { title: '删除人', dataIndex: 'cancelName', width: '5%' },
        { title: '删除时间', dataIndex: 'cancelDate', width: '6%' },
        { title: '类型', dataIndex: 'aminoAcidType', width: '4%', align: 'center' },
        { title: '长代码', dataIndex: 'longCode', width: '8%', align: 'center' },
        { title: '短代码', dataIndex: 'shortCode', width: '5%', align: 'center' }
      ],
      queryParam: {},
      loadData: parameter => {
        // parameter.rows *= 2;
        // console.log(parameter);
        this.queryParam = this.form.getFieldsValue();
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getAminoAcid(params).then(res => {
          // console.log(res.rows);
          // for (let index in res.rows) {
          //   if (index % 2 == 1) {
          //     delete res.rows[index].id;
          //     // res.rows[index].id = '';
          //   }
          // }
          var map = {}; var dest = [];
          for (let i = 0; i < res.rows.length; i++) {
            // console.log(res.rows[i]);
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
          return {
            data: dest,
            page: params.page,
            total: dest.length * 2
          };
        });
      },
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  mounted () {
    var selectDrop = document.getElementsByClassName('ant-checkbox')[0];
    selectDrop.style.display = 'none';
  },
  methods: {
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
      this.selectedRows = selectedRows;
    },
    addTr (num) {
      document.getElementById('add').setAttribute('disabled', true);
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 2 || i === 8 || i === 9 || i === 10 || i === 11) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 3 || i === 4 || i === 5 || i === 6 || i === 7) {
          tdObj.style.backgroundColor = 'blue';
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='checkbox' id='addValue" + i + "'/>";
        } else if (i === 17) {
          tdObj.innerHTML = "<input type='text' value='L | D' disabled style='width: 100%;border: none;text-align:center;background-color: white;' id='addValue" + i + "'/>";
        } else if (i === 18 || i === 19) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else {
          tdObj.style.backgroundColor = 'blue';
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
    },
    addData () {
      var addVal = document.getElementById('addValue').value;
      if (addVal === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      this.$api.peptide.insertPurity({ 'purity': addVal }).then(res => {
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
        this.$api.peptide.deleteAminoAcid(this.selectedRowKeys[0]).then(res => {
          this.selectedRowKeys = [];
          return this.$refs.table.refresh(true);
        });
      } else {
        this.utils.refresh();
      }
    },
    handleResume () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeAminoAcid(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
