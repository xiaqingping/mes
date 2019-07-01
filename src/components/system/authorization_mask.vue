<template>
  <div v-if="hackReset" class="mask">

    <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '700px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">产品列表</span>
        <span class="top-icon" style="padding-bottom: 10px" @click="onClose"><a-icon type="close"/></span>
        <span class="top-icon" @click="onSmall" v-show="small"><a-icon type="plus-square"/></span>
        <span class="top-icon" @click="onSmall" v-show="!small"><a-icon type="minus-square"/></span>
      </div>

      <div class="middle-search" style="margin: 0 3%">
        <a-form layout="inline" :form="form" @submit="handleSearch">
          <div>
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title="" style="width: 193px"/>
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-decorator="['name']" style="width: 162px"/>
            </a-form-item>
            <a-form-item label="角色">
              <a-select v-decorator="['roleID']" style="width: 165px">
                <a-select-option v-for="item in roles" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="大区">
              <a-select v-decorator="['regionCode']" style="width: 165px">
                <a-select-option v-for="item in regions" :key="item.id" :value="item.id" v-if="item.id==0">
                  {{ item.name }}
                </a-select-option>
                <a-select-option v-for="item in regions" :key="item.id" :value="item.id" v-if="item.id!=0">
                  {{ item.id }} - {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="网点">
              <a-select v-decorator="['officeCode']" style="width: 165px">
                <a-select-option v-for="item in offices" :key="item.id" :value="item.id" v-if="item.id==0">
                  {{ item.name }}
                </a-select-option>
                <a-select-option v-for="item in offices" :key="item.id" :value="item.id" v-if="item.id!=0">
                  {{ item.id }} - {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="员工">
              <a-input v-decorator="['employeeCode']" style="width: 148px"/>
            </a-form-item>
          </div>
          <div style="margin-bottom:10px">
            <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
            <a-button type="primary" @click="sub" style="float:right">确定</a-button>
          </div>
        </a-form>

      </div>
      <s-table
        ref="table"
        bordered
        size="small"
        :scroll="{ x: 2000, y: 400}"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
      </s-table>

    </div>
  </div>
</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'AuthorizationMask',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      hackReset: true,
      status: false,
      small: true,
      customer_name_top: 0,
      customer_name_left: 0,
      roles: [],
      regions: [],
      offices: [],
      columns: [
        { title: '员工', dataIndex: 'employeeCode', width: '5%' },
        { title: '编号', dataIndex: 'loginCode', width: '6%' },
        { title: '姓名', dataIndex: 'name', width: '6%' },
        {
          title: '角色',
          dataIndex: 'roleID',
          width: '6%'
          // customRender: function (value) {
          //   var val = this.$store.state.system.roles;
          //   console.log(val);
          //   for (let i = 0; i < val.length; i++) {
          //     if (val[i].id === value) {
          //       if (val[i].id === 0) {
          //         val[i].name = 0;
          //         return val[i].name;
          //       }
          //       return val[i].name;
          //     }
          //   }
          // }
        },
        { title: '大区', dataIndex: 'regionCode', width: '6%' },
        { title: '网点', dataIndex: 'officeCode', width: '6%' },
        { title: '客户', dataIndex: 'customerCode', width: '6%' },
        { title: '测序点', dataIndex: 'cxPointId', width: '6%' },
        { title: '仓库', dataIndex: 'storageCode', width: '5%' },
        { title: '状态', dataIndex: 'isdel', width: '5%' },
        { title: '登录时间', dataIndex: 'loginDate', width: '10%' },
        { title: '创建时间', dataIndex: 'createDate', width: '10%' },
        { title: 'ID', dataIndex: 'code' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.user.getUserList(params).then(res => {
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
      },
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  watch: {
    status: function () {
      if (this.status) {
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
        this.status = false;
        this.small = true;
      }
    }
  },
  mounted () {
    this.selectedRows = [];
    this.selectedRowKeys = [];
    var selectDrop = document.getElementsByClassName('ant-checkbox')[3];
    selectDrop.style.display = 'none';
    // 缓存取值
    this.roles = this.$store.state.system.roles;
    this.regions = this.$store.state.system.regions;
    this.offices = this.$store.state.system.offices;
    // 子页面位置
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    if (width > 1000) {
      this.customer_name_left = (width - 1100) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 700) / 2;
    }
  },
  methods: {
    sub () {
      if (this.selectedRows[0]) {
        this.$emit('customerData', this.selectedRows);
        this.$emit('Closed');
        this.selectedRows = [];
        this.selectedRowKeys = [];
      } else {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
      }
    },
    onClose () {
      this.$emit('Closed');
      this.status = true;
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    onSmall () {
      this.small = !this.small;
    },
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows.slice(-1);
      if (this.selectedRows[0]) {
        for (let i = 0; i < this.selectedRows[0].length; i++) {
          this.selectedRows[0][i]['id'] = i + 1;
        }
        this.dataSon = this.selectedRows[0];
      } else {
        this.dataSon = [];
      }
    },
    onChange (dates, dateStrings) {
      this.createDateBegin = dateStrings[0];
      this.createDateEnd = dateStrings[1];
    }
  }
};
</script>

<style lang="scss" scoped>
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow: hidden;
  }

  .customer-name-mask {
    background: white;
    box-shadow: 2px 2px 4px gray;

    .top {
      height: 40px;
      line-height: 40px;
      margin: 0 2%;
      color: gray;

      .top-icon {
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
        float: right;
      }

      .top-icon:hover {
        color: black;
      }
    }

    .middle-search {
      .ant-row {
        margin-left: 5px;
      }
    }
  }
</style>
