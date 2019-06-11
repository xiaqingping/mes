
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="员工编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="14">
            <a-form-item label="员工名称">
              <a-input v-decorator="['staffName']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="年：">
              <a-select v-decorator="['year', {initialValue : '0'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">2019</a-select-option>
                <a-select-option value="2">2018</a-select-option>
                <a-select-option value="3">2017</a-select-option>
                <a-select-option value="4">2016</a-select-option>
                <a-select-option value="5">2015</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="月：">
              <a-select v-decorator="['month', {initialValue : '0'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">1</a-select-option>
                <a-select-option value="2">2</a-select-option>
                <a-select-option value="3">3</a-select-option>
                <a-select-option value="4">4</a-select-option>
                <a-select-option value="5">5</a-select-option>
                <a-select-option value="6">6</a-select-option>
                <a-select-option value="7">7</a-select-option>
                <a-select-option value="8">8</a-select-option>
                <a-select-option value="9">9</a-select-option>
                <a-select-option value="10">10</a-select-option>
                <a-select-option value="11">11</a-select-option>
                <a-select-option value="12">12</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="状态：">
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

    <div class="table-operator">
      <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
      <a-button type="primary" icon="delete" @click="handleDelete">作废</a-button>
      <!-- <a-button type="primary" icon="file-excel" @click="handleUpload">excel上传</a-button> -->
      <a-upload :multiple="true" :fileList="fileList" @change="handleChange">
        <a-button type="primary" icon="file-excel">
          <a-icon type="primary" icon="file-excel" /> 上传
        </a-button>
      </a-upload>
    </div>
    <!-- 表格 -->
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
</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      fileList: [
        // {
        // uid: '-1',
        // name: 'xxx.png',
        // status: 'done',
        // url: 'https://588ku.com/sucai/0-default-0-0-0-0-1/?h=bd&sem=1'
        // }
      ],
      columns: [
        { title: '员工编号', dataIndex: 'employeeCode' },
        { title: '员工名称', dataIndex: 'employeeName' },
        { title: '总额', dataIndex: 'amount' },
        { title: '时间', dataIndex: 'year' },
        { title: '状态', dataIndex: 'status', customRender: function (text) { if (text === 1) return '正常'; else if (text === 2) return '已删除'; }
        },
        { title: '创建人', dataIndex: 'createName' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.pay.getPay(params).then(res => {
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
  mounted () {},
  methods: {
    // 查询
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
    // 删除
    handleDelete () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.pay.deletepays(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
      // console.log(1);
    },
    // 上传excel
    handleChange () {
      // let fileList = [...info.fileList];
      // // 1.限制上传文件的数量，只显示最近上传的两个文件，旧文件将被新文件替换
      // fileList = fileList.slice(-2);
      // // 2. 读取响应并显示文件链接
      // fileList = fileList.map((file) => {
      //   if (file.response) {
      //     // 组件将显示文件。url链接
      //     file.url = file.response.url;
      //     console.log('这是url的' + file.response.url);
      //   }
      //   return file;
      // });
      // this.fileList = fileList;
      const data = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      this.$api.pay.uploadpays(data, config).then(res => {
        console.log('这是' + data);
        // return this.$refs.table.refresh(true);
      }).then(res => {
        // this.fileList.status = 'success';
        console.log('成功了');
      }).catch(res => {
        // this.fileList.status = 'fail';
        console.log('失败了');
      });
    },
    // 表格
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(selectedRowKeys);
      this.selectedRows = selectedRows;
      console.log(selectedRows);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
