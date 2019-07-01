<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="角色">
                <a-select v-decorator="['roleID']">
                  <a-select-option v-for="item in roles" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="大区">
                <a-select v-decorator="['regionCode']">
                  <a-select-option v-for="item in regions" :key="item.id" :value="item.id" v-if="item.id==0">
                    {{ item.name }}
                  </a-select-option>
                  <a-select-option v-for="item in regions" :key="item.id" :value="item.id" v-if="item.id!=0">
                    {{ item.id }} - {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="网点">
                <a-select v-decorator="['officeCode']">
                  <a-select-option v-for="item in offices" :key="item.id" :value="item.id" v-if="item.id==0">
                    {{ item.name }}
                  </a-select-option>
                  <a-select-option v-for="item in offices" :key="item.id" :value="item.id" v-if="item.id!=0">
                    {{ item.id }} - {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="员工">
                <a-input-search v-decorator="['employeeCode']" />
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-decorator="['isdel']">
                  <a-select-option v-for="item in isdel" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="12" :md="16" :sm="24">
              <a-form-item label="登陆时间">
                <a-range-picker
                  :ranges="{ 今天: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }"
                  :placeholder="['开始日期', '结束日期']"
                  format="YYYY-MM-DD">
                </a-range-picker>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
      <a-button type="primary" icon="plus">新建</a-button>
      <a-button type="primary" icon="edit">修改</a-button>
      <a-button type="primary" icon="save">保存</a-button>
      <a-button type="primary" icon="form">重置密码</a-button>
      <a @click="toggleAdvanced" style="margin-left: 8px">
        {{ advanced ? '收起' : '展开' }}
        <a-icon :type="advanced ? 'up' : 'down'"/>
      </a>
    </div>

    <s-table
      ref="table"
      size="small"
      bordered
      :scroll="{ x: 2000 }"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
    </s-table>

    <!-- <vxe-grid
    >
    </vxe-grid> -->
  </div>
</template>

<script>
import STable from '@/components/Table';
import moment from 'moment';

export default {
  name: 'SystemUser',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      advanced: true,
      roles: [],
      regions: [],
      offices: [],
      isdel: [],
      columns: [
        { title: '员工', dataIndex: 'employeeCode' },
        { title: '编号', dataIndex: 'loginCode' },
        { title: '姓名', dataIndex: 'name' },
        {
          title: '角色',
          dataIndex: 'roleID'
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
        { title: '大区', dataIndex: 'regionCode' },
        { title: '网点', dataIndex: 'officeCode' },
        { title: '客户', dataIndex: 'customerCode' },
        { title: '测序点', dataIndex: 'cxPointId' },
        { title: '仓库', dataIndex: 'storageCode' },
        { title: '状态', dataIndex: 'isdel' },
        { title: '登录时间', dataIndex: 'loginDate' },
        { title: '创建时间', dataIndex: 'createDate' },
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
  mounted () {
    this.roles = this.$store.state.system.roles;
    this.regions = this.$store.state.system.regions;
    this.offices = this.$store.state.system.offices;
    this.isdel = this.$store.state.system.isdel;
    // this.$api.system.getModificationTypesAll().then(res => {
    //   this.modificationsType = res;
    // });
  },
  methods: {
    moment,
    // 查询
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced () {
      this.advanced = !this.advanced;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
