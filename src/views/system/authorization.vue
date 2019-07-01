<template>
  <div class="page-content">
    <!-- 查询搜索 -->
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>
    <!-- 中间内容 -->
    <div>
      <a-row :gutter="0">
        <a-col :span="6">
          <a-card title="员工列表">
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="search" @click="handleSearch">查询</a-button>
                <a-button type="primary" size="small" icon="plus" @click="handleIncrease(4)" id="add">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              style="height:500px"
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 600, y: 400 }"
              :columns="columns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
            </s-table>
          </a-card>
        </a-col>
        <a-col :span="5">
          <a-card title="用户权限明细">
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="redo">刷新</a-button>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              style="height:500px"
              ref="table1"
              size="small"
              bordered
              :scroll="{ x: 300, y: 400 }"
              :columns="columnOne"
              :data="loadDataOne"
              :rowSelection="{ selectedRowKeys: selectedRowKeyOne, onChange: onSelectChangeOne }"
            >
            </s-table>
          </a-card>
        </a-col>
        <a-col :span="13">
          <a-card title="明细" >
            <s-table
              style="height:523px"
              ref="table2"
              size="small"
              bordered
              :scroll="{ x: 1500, y: 424 }"
              :columns="columnTwo"
              :data="loadDataTwo"
              :rowSelection="{ selectedRowKeys: selectedRowKeyTwo, onChange: onSelectChangeTwo }"
            >
            </s-table>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <authorization-mask v-show="authorization_status" @Closed="closeMask()">
    </authorization-mask>

  </div>
</template>

<script>
import STable from '@/components/Table';
import AuthorizationMask from '@/components/system/authorization_mask';

export default {
  name: 'SystemAuthorization',
  components: {
    STable,
    AuthorizationMask
  },
  data () {
    return {
      form: this.$form.createForm(this),
      authorization_status: false,
      // 员工列表
      columns: [
        { title: 'ID', dataIndex: 'code', width: '50%' },
        { title: '姓名', dataIndex: 'name', width: '20%' },
        { title: '员工号', dataIndex: 'employeeCode' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.system.getDataAuthList(params).then(res => {
          // console.log(res.rows);
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
      },
      selectedRowKeys: [],
      selectedRows: [],

      // 用户权限明细
      columnOne: [
        {
          title: '类型',
          dataIndex: 'ruleType',
          width: '30%',
          customRender: function (value) {
            if (value === 1) {
              return '规则';
            } else if (value === 2) {
              return '分组';
            }
          }
        },
        { title: '权限', dataIndex: 'ruleName' }
      ],
      queryParamOne: {},
      loadDataOne: parameter => {
        const params = this.loadDataId;
        return this.$api.system.getAuthorityList(params).then(res => {
          return {
            data: res,
            page: params.page,
            total: res.total
          };
        });
      },
      selectedRowKeyOne: [],
      selectedRowOne: [],
      loadDataId: 0,

      // 明细
      columnTwo: [
        { title: '名称', dataIndex: 'name', width: '13%' },
        { title: 'Client', dataIndex: 'sourceClient', width: '6%' },
        { title: 'Type', dataIndex: 'sourceType', width: '5%' },
        { title: '资源', dataIndex: 'sourcePath', width: '10%' },
        { title: '资源描述', dataIndex: 'sourceDesc', width: '12%' },
        { title: '类型参数', dataIndex: 'paramType', width: '8%' },
        { title: '参数', dataIndex: 'parameterField', width: '8%' },
        { title: '参数描述', dataIndex: 'parameterDesc', width: '8%' },
        { title: 'OP', dataIndex: 'op', width: '5%' },
        { title: '值', dataIndex: 'value', width: '6%' },
        { title: '状态', dataIndex: 'status' }
      ],
      queryParamTwo: {},
      loadDataTwo: parameter => {
        const params = this.loadDataIdOne;
        return this.$api.system.getGroupRulesList(params).then(res => {
          // console.log(res.rows);
          console.log(this.loadDataIdOne);
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
      },
      selectedRowKeyTwo: [],
      selectedRowTwo: [],
      loadDataIdOne: 10
    };
  },
  watch: {
    loadDataId: function () {
      this.$refs.table1.refresh(true);
    },
    loadDataOneId: function () {
      this.$refs.table2.refresh(true);
    }
  },
  mounted () {
    var selectDrop = document.getElementsByClassName('ant-checkbox')[0];
    selectDrop.style.display = 'none';
    var selectDropOne = document.getElementsByClassName('ant-checkbox')[1];
    selectDropOne.style.display = 'none';
    var selectDropTwo = document.getElementsByClassName('ant-checkbox')[2];
    selectDropTwo.style.display = 'none';
  },
  methods: {
    // 模态框展示
    showDrawer () {
      this.visible = true;
    },
    onClose () {
      this.visible = false;
    },
    // 员工列表
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows.slice(-1);
      this.loadDataId = this.selectedRowKeys[0];
    },
    // 新增
    handleIncrease (num) {
      var self = this;
      document.getElementById('add').setAttribute('disabled', true);
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 1) {
          tdObj.innerHTML = "<div style='position: relative;width: 100%;height: 100%'><input type='text' readonly title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><span class='iconfont icon-suosou' id='openMask' style='position: absolute;right:0;top:0;cursor:pointer;font-weight:bold;color:#8C8C8C'></span></div>";
        } else if (i === 2 || i === 3) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else {
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='checkbox' id='addValue" + i + "'/>";
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
    openMask () {
      this.authorization_status = true;
    },
    closeMask () {
      this.authorization_status = false;
    },

    // 用户权限明细
    onSelectChangeOne (selectedRowKeyOne, selectedRowOne) {
      this.selectedRowKeyOne = selectedRowKeyOne.slice(-1);
      this.selectedRowOne = selectedRowOne.slice(-1);
      // this.loadDataIdOne = this.selectedRowOne[0]['ruleId'];
      this.loadDataIdOne = this.selectedRowKeyOne[0];
      // console.log(this.loadDataIdOne);
    },

    // 明细
    onSelectChangeTwo (selectedRowKeyTwo, selectedRowTwo) {
      this.selectedRowKeyTwo = selectedRowKeyTwo.slice(-1);
      this.selectedRowTwo = selectedRowTwo.slice(-1);
      // console.log(selectedRowTwo);
    },

    toggleAdvanced () {
      this.advanced = !this.advanced;
    },
    handleSearch () {
      this.$refs.table.refresh(true);
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-card-body{
  padding: 3px
}
</style>
