<template>
  <div v-if="hackReset" class="mask">
    <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '660px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">多肽合成订单编辑页面</span>
        <span class="top-icon" style="padding-bottom: 10px" @click="onClose"><a-icon
          type="close"/></span>
        <span class="top-icon" @click="onSmall" v-show="small"><a-icon
          type="plus-square"/></span>
        <span class="top-icon" @click="onSmall" v-show="!small"><a-icon
          type="minus-square"/></span>
      </div>
      <a-form :form="form" layout="inline">
        <div id="svgBox">
          <div id="svgTop" style="height:400px">
            <div style="width:800px;margin:0 auto;">
              <a-form-item label="订单编号">
                <a-input class="readyOnly" v-decorator="['code']" style="width:200px" disabled />
              </a-form-item>
              <a-form-item class="marginLeft" label="销售类型">
                <a-select v-decorator="['salesType', {initialValue : 'ZTP1 - 按单采购销售订单'}]" style="width:200px">
                  <a-select-option value="ZTP1 - 按单采购销售订单">ZTP1 - 按单采购销售订单</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="客户">
                <a-input class="readyOnly" v-decorator="['customerName']" style="width:230px;background-color: #FFF3F3;border: 1px solid #FFA8A8;" disabled/>
                <span class="iconfont icon-suosou" id="openMask" @mouseover="changeColor($event, 1)" @mouseout="changeColor($event, 2)" style="position: absolute;right:5px;top:-8px;cursor:pointer;font-weight:bold;color:black;opacity:0.5;"></span>
              </a-form-item>
              <a-form-item class="marginLeft" label="销售范围">
                <a-select v-decorator="['range', {initialValue : '10-3110'}]" style="width:200px">
                  <a-select-option v-for="item in rangeArea" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="负责人">
                <a-input class="readyOnly" v-decorator="['subCustomerName']" style="width:215px;background-color: #FFF3F3;border: 1px solid #FFA8A8;" disabled/>
                <span class="iconfont icon-suosou" id="openMask" @mouseover="changeColor($event, 1)" @mouseout="changeColor($event, 2)" style="position: absolute;right:5px;top:-8px;cursor:pointer;font-weight:bold;color:black;opacity:0.5;"></span>
              </a-form-item>
              <a-form-item class="marginLeft" label="销售大区">
                <a-select v-decorator="['regionCode', {initialValue : '3100 - 总部大区'}]" style="width:200px">
                  <a-select-option value="3100 - 总部大区">3100 - 总部大区</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="订货人">
                <a-input class="readyOnly" v-decorator="['contactName']" style="width:215px;background-color: #FFF3F3;border: 1px solid #FFA8A8;" disabled/>
                <span class="iconfont icon-suosou" id="openMask" @mouseover="changeColor($event, 1)" @mouseout="changeColor($event, 2)" style="position: absolute;right:5px;top:-8px;cursor:pointer;font-weight:bold;color:black;opacity:0.5;"></span>
              </a-form-item>
              <a-form-item class="marginLeft" label="销售网点">
                <a-select v-decorator="['officeCode', {initialValue : '998 - 总部-国际'}]" style="width:200px">
                  <a-select-option value="998 - 总部-国际">998 - 总部-国际</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="配送网点">
                <a-select v-decorator="['dofficeCode']" style="width:200px">
                  <a-select-option value="998 - 总部-国际">998 - 总部-国际</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="marginLeft" label="销售员">
                <a-input class="readyOnly" v-decorator="['salerName']" style="width:215px" disabled/>
              </a-form-item>
              <a-form-item label="销售部门">
                <a-select v-decorator="['officeCode', {initialValue : 'A008 - 多肽部'}]" style="width:200px">
                  <a-select-option value="A008 - 多肽部">A008 - 多肽部</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="marginLeft" label="信用额度">
                <a-input class="readyOnly" v-decorator="['credit']" style="width:200px" disabled/>
              </a-form-item>
              <a-form-item label="开票方式">
                <a-select v-decorator="['invoiceType', {initialValue : 'A008 - 多肽部'}]" style="width:200px">
                  <a-select-option value="A008 - 多肽部">A008 - 多肽部</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="marginLeft" label="信用余额">
                <a-input class="readyOnly" v-decorator="['balance']" style="width:200px" disabled/>
              </a-form-item>
              <a-form-item label="付款方式">
                <a-select v-decorator="['paymentMethod', {initialValue : 'A008 - 多肽部'}]" style="width:200px">
                  <a-select-option value="A008 - 多肽部">A008 - 多肽部</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="marginLeft" label="专项经费">
                <a-input class="readyOnly" v-decorator="['depositBalance']" style="width:200px" disabled/>
              </a-form-item>
              <a-form-item label="付款条件">
                <a-select v-decorator="['paymentTerm', {initialValue : 'A008 - 多肽部'}]" style="width:200px">
                  <a-select-option value="A008 - 多肽部">A008 - 多肽部</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="marginLeft" label="SAP销售订单编号">
                <a-input class="readyOnly" v-decorator="['sapOrderCode']" style="width:148px" disabled/>
              </a-form-item>
              <a-form-item label="随货开票">
                <a-select v-decorator="['invoiceByGoods', {initialValue : 0}]" style="width:200px">
                  <a-select-option v-for="item in invoiceByGoodsStatus" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="marginLeft" label="SAP交货单号">
                <a-input class="readyOnly" v-decorator="['sapDeliveryCode']" style="width:176px" disabled/>
              </a-form-item>
              <a-form-item label="SAP采购申请单号">
                <a-input class="readyOnly" v-decorator="['sapProcureApplyCode']" style="width:148px" disabled />
              </a-form-item>
              <a-form-item class="marginLeft" label="客户订单号">
                <a-input v-decorator="['customerPoCode']" style="width:188px" />
              </a-form-item>
              <a-form-item label="客户订单日期">
                <a-input class="readyOnly" v-decorator="['customerPoDate']" style="width:174px" disabled />
              </a-form-item>
              <a-form-item class="marginLeft" label="交货方式">
                <a-select v-decorator="['deliveryType', {initialValue : '01 - 总部直发'}]" style="width:200px">
                  <a-select-option value="01 - 总部直发">01 - 总部直发</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="仓库">
                <a-select v-decorator="['storageCode', {initialValue : '01 - 总部直发'}]" style="width:230px">
                  <a-select-option value="01 - 总部直发">01 - 总部直发</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="marginLeft" label="工厂">
                <a-select v-decorator="['factory', {initialValue : '3100 - 生工上海工厂'}]" style="width:230px">
                  <a-select-option value="3100 - 生工上海工厂">3100 - 生工上海工厂</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="产品金额">
                <a-input class="readyOnly" id="productAmount" v-model="add.add1" style="width:202px;text-align:right" disabled />
              </a-form-item>
              <a-form-item class="marginLeft" label="订单类型">
                <a-select v-decorator="['orderType', {initialValue : 0}]" style="width:202px">
                  <a-select-option v-for="item in orderTypeStatus" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="运费">
                <a-input id="freight" v-model="add.add2" style="width:230px;text-align:right;color:black"/>
              </a-form-item>
              <a-form-item class="marginLeft" label="订单金额">
                <a-input class="readyOnly" id="amount" v-model="sum" style="width:202px;text-align:right" disabled/>
              </a-form-item>
              <a-form-item label="订货人邮箱">
                <a-input v-decorator="['contactEmail']" style="width:188px;background-color: #FFF3F3;border: 1px solid #FFA8A8;" />
              </a-form-item>
              <a-form-item class="marginLeft" label="订货人手机">
                <a-input v-decorator="['contactMobile']" style="width:188px;background-color: #FFF3F3;border: 1px solid #FFA8A8;" />
              </a-form-item>
              <a-form-item label="币种" style="margin-right: 352px">
                <a-select v-decorator="['currency', {initialValue : 'CNY - 人民币'}]" style="width:230px">
                  <a-select-option value="CNY - 人民币">CNY - 人民币</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="备注">
                <a-input v-decorator="['remark']" style="width:565px" />
              </a-form-item>
              <a-form-item label="地址">
                <a-select v-decorator="['address']" style="width:565px">
                  <a-select-option value="">请选择地址</a-select-option>
                </a-select>
                <span class="iconfont icon-jia" @mouseover="changeColor($event, 1)" @mouseout="changeColor($event, 2)" style="position: absolute;right:30px;top:-9px;color:green;cursor:pointer;opacity:0.5;"></span>
              </a-form-item>
              <a-form-item label="创建人">
                <a-input class="readyOnly" v-decorator="['creatorCode']" style="width:215px" disabled/>
              </a-form-item>
              <a-form-item class="marginLeft" label="创建日期">
                <a-input class="readyOnly" v-decorator="['createDate']" style="width:200px" disabled />
              </a-form-item>
              <a-form-item label="修改人">
                <a-input class="readyOnly" v-decorator="['changerName']" style="width:215px" disabled/>
              </a-form-item>
              <a-form-item class="marginLeft" label="修改日期">
                <a-input class="readyOnly" v-decorator="['changeDate']" style="width:200px" disabled />
              </a-form-item>
              <a-form-item label="审核人">
                <a-input class="readyOnly" v-decorator="['checkName']" style="width:215px" disabled/>
              </a-form-item>
              <a-form-item class="marginLeft" label="审核日期">
                <a-input class="readyOnly" v-decorator="['checkDate']" style="width:200px" disabled />
              </a-form-item>
              <a-form-item label="完成人">
                <a-input class="readyOnly" v-decorator="['finishName']" style="width:215px" disabled/>
              </a-form-item>
              <a-form-item class="marginLeft" label="完成日期">
                <a-input class="readyOnly" v-decorator="['finishDate']" style="width:200px" disabled />
              </a-form-item>
            </div>
            <svg width="100%" id="controllerSvg" style="height:0"></svg>
          </div>
          <div id="svgResize" style="border-top: 2px solid #b5b9a9; "></div>
          <div id="svgDown">
            <a-layout>
              <a-layout-content>
                <div style="height:100%;position: relative;margin-top:5px">
                  <div class="sonButton">
                    <a-button type="primary" icon="edit">批量导入序列</a-button>
                    <a-button type="primary" icon="plus">新增</a-button>
                    <a-button type="primary" icon="delete">删除</a-button>
                    <a-button type="primary" icon="save">保存</a-button>
                  </div>
                  <!-- <vxe-grid
                    :columns="columns"
                    :dataSource="data"
                    bordered
                    rowKey="id"
                    ref="table1"
                    size="small"
                    :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :scroll="{ x: 3200, y: 400}"> -->
                  <vxe-grid
                    highlight-hover-row
                    auto-resize
                    :ref="productTable.ref"
                    :columns="columns"
                    :data.sync="productTable.tableData"
                    :loading="productTable.loading"
                    :edit-rules="productTable.editRules"
                    :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
                    :pager-config="productTable.pagerConfig"
                    @cell-click="(options) => handleCellClick(options)"
                    @cell-dblclick="(options) => sub(options)"
                    @page-change="pagerChange"
                  >
                  </vxe-grid>
                </div>
              </a-layout-content>
              <a-layout-sider width="550">
                <h4 style="text-align:left">氨基酸</h4>
                <div class="sonButton">
                  <a-input style="width: 100px; margin-right:10px"/>
                  <a-button type="primary" icon="edit">修改价格</a-button>
                  <a-button type="primary" icon="plus">新增</a-button>
                  <a-button type="primary" icon="delete">删除</a-button>
                  <a-button type="primary" icon="save">保存</a-button>
                </div>
                <!-- <vxe-grid
                  :columns="columnSon"
                  :dataSource="dataSon"
                  bordered
                  rowKey="id"
                  ref="table1"
                  size="small"
                  :scroll="{ x: 600, y: 400}"> -->
                <vxe-grid
                  highlight-hover-row
                  auto-resize
                  :ref="productSonTable.ref"
                  :loading="productSonTable.loading"
                  :columns="columnSon"
                  :data.sync="productSonTable.tableData"
                  :edit-rules="productSonTable.editRules"
                  :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
                >
                </vxe-grid>
              </a-layout-sider>
            </a-layout>
          </div>
          <svg width="100%" id="serverSvg"></svg>
          <div class="bottomButton">
            <a-button
              type="primary"
              @click="sub"
              icon="check"
            >
              保存
            </a-button>
            <a-button
              style="margin-left:10px"
              type="primary"
              @click="onClose"
              icon="close"
            >
              取消
            </a-button>
          </div>

        </div>
      </a-form>
    </div>
  </div>

</template>

<script>
const tableName = 'productTable';
const tableNameSon = 'productSonTable';

export default {
  name: 'AddMask',
  data () {
    return {
      form: this.$form.createForm(this),
      productTable: {
        id: 0,
        ref: 'productTable',
        xTable: null,
        editIndex: -1,
        // loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      productSonTable: {
        id: 0,
        ref: 'productSonTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      },
      small: false,
      customer_name_top: 0,
      customer_name_left: 0,
      hackReset: true,
      status: false,
      rangeArea: [],
      invoiceByGoodsStatus: [],
      orderTypeStatus: [],
      add: { add1: '0.00', add2: '0.00' },
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        { title: '编号', field: 'code', width: 100 },
        { title: '多肽名称', field: 'name', width: 100 },
        { title: '提供总量(mg)', field: 'providerTotalAmount', width: 100 },
        { title: '是否脱盐', field: 'isNeedDesalting', width: 100 },
        { title: '纯度', field: 'peptidePurityId', width: 100 },
        { title: '序列', field: 'sequence', width: 100 },
        { title: '氨基酸数', field: 'aminoAcidCount', width: 100 },
        { title: '氨基酸金额', field: 'aminoAcidAmount', width: 100 },
        { title: '氨基端修饰', field: 'aminoModificationName', width: 100 },
        { title: '氨基端修饰金额', field: 'aminoModificationPrice', width: 110 },
        { title: '氨基端修饰SAP产品编号', field: 'aminoSapProductCode', width: 160 },
        { title: '氨基端修饰SAP产品名称', field: 'aminoSapProductName', width: 160 },
        { title: '羧基端修饰', field: 'carboxyModificationName', width: 100 },
        { title: '羧基端修饰金额', field: 'carboxyModificationPrice', width: 110 },
        { title: '羧基端修饰SAP产品编号', field: 'carboxySapProductCode', width: 160 },
        { title: '羧基端修饰SAP产品名称', field: 'carboxySapProductName', width: 160 },
        { title: '中间修饰', field: 'middleModification', width: 100 },
        { title: '中间修饰数量', field: 'middleModificationDetailCount', width: 100 },
        { title: '中间修饰金额', field: 'middleModificationDetailAmount', width: 100 },
        { title: '二硫键', field: 'disulfideBond', width: 100 },
        { title: '二硫键数量', field: 'disulfideBondDetailCount', width: 100 },
        { title: '二硫键金额', field: 'disulfideBondDetailAmount', width: 100 },
        { title: '分装管数', field: 'subpackage', width: 100 },
        { title: '金额', field: 'totalAmount', width: 100 },
        { title: '备注', field: 'notes', width: 100 }
      ],
      columnSon: [
        { title: '氨基酸', field: 'aminoAcidID', width: 100 },
        { title: '类型', field: 'aminoAcidType', width: 100 },
        { title: '长代码', field: 'longCode', width: 100 },
        { title: '短代码', field: 'shortCode', width: 100 },
        { title: '单价', field: 'price', width: 100 },
        { title: 'SAP产品编号', field: 'sapProductCode', width: 100 },
        { title: 'SAP产品名称', field: 'sapProductName', width: 100 }
      ],
      dataSon: [],
      data: []
    };
  },
  mounted () {
    this.dragControllerDiv();
    document.body.parentNode.style.overflowY = 'hidden';
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    this.rangeArea = this.$store.state.peptide.rangeArea;
    this.invoiceByGoodsStatus = this.$store.state.peptide.invoiceByGoodsStatus;
    this.orderTypeStatus = this.$store.state.peptide.orderTypeStatus;
    if (width > 1000) {
      this.customer_name_left = (width - 1100) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 660) / 2;
    }
  },
  watch: {
    status: function () {
      if (this.status) {
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
        this.status = false;
        this.small = false;
      }
    }
  },
  computed: {
    sum () {
      return (parseFloat(this.add.add1) + parseFloat(this.add.add2)).toFixed(2);
    }
  },
  methods: {
    // setColumns () {
    //   const { peptide } = this.$store.state;
    //   this.status = peptide.status;
    //   this.modificationPositionData = peptide.modificationPosition;
    //   const columns = [
    //     { title: '编号', field: 'code' },
    //     { title: '多肽名称', field: 'name', width: '80px' },
    //     { title: '提供总量(mg)', field: 'providerTotalAmount' },
    //     { title: '是否脱盐', field: 'isNeedDesalting' },
    //     { title: '纯度', field: 'peptidePurityId' },
    //     { title: '序列', field: 'sequence' },
    //     { title: '氨基酸数', field: 'aminoAcidCount' },
    //     { title: '氨基酸金额', field: 'aminoAcidAmount' },
    //     { title: '氨基端修饰', field: 'aminoModificationName' },
    //     { title: '氨基端修饰金额', field: 'aminoModificationPrice' },
    //     { title: '氨基端修饰SAP产品编号', field: 'aminoSapProductCode' },
    //     { title: '氨基端修饰SAP产品名称', field: 'aminoSapProductName' },
    //     { title: '羧基端修饰', field: 'carboxyModificationName' },
    //     { title: '羧基端修饰金额', field: 'carboxyModificationPrice' },
    //     { title: '羧基端修饰SAP产品编号', field: 'carboxySapProductCode' },
    //     { title: '羧基端修饰SAP产品名称', field: 'carboxySapProductName' },
    //     { title: '中间修饰', field: 'middleModification' },
    //     { title: '中间修饰数量', field: 'middleModificationDetailCount' },
    //     { title: '中间修饰金额', field: 'middleModificationDetailAmount' },
    //     { title: '二硫键', field: 'disulfideBond' },
    //     { title: '二硫键数量', field: 'disulfideBondDetailCount' },
    //     { title: '二硫键金额', field: 'disulfideBondDetailAmount' },
    //     { title: '分装管数', field: 'subpackage' },
    //     { title: '金额', field: 'totalAmount' },
    //     { title: '备注', field: 'notes' }
    //   ];
    //   const columnSon = [
    //     { title: '氨基酸', field: 'aminoAcidID' },
    //     { title: '类型', field: 'aminoAcidType' },
    //     { title: '长代码', field: 'longCode' },
    //     { title: '短代码', field: 'shortCode' },
    //     { title: '单价', field: 'price' },
    //     { title: 'SAP产品编号', field: 'sapProductCode' },
    //     { title: 'SAP产品名称', field: 'sapProductName' }
    //   ];

    //   columns.forEach(function (e) {
    //     if (!e.width) e.width = 100;
    //   });

    //   columnSon.forEach(function (e) {
    //     if (!e.width) e.width = 100;
    //   });

    //   this[tableName].columns = columns;
    //   this[tableNameSon].columns = columnSon;
    //   this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    //   this[tableNameSon].xTable = this.$refs[this[tableNameSon].ref].$refs.xTable;
    // },
    handleCellClick ({ row }) {
      this[tableNameSon].tableData = row.stock.storages.map((value, index, array) => {
        return Object.assign({ id: value.storage }, value);
      });
    },
    handleSearch (e) {
      // if (e) e.preventDefault();
      // // this[tableName].loading = true;
      // const queryParam = this.form.getFieldsValue();
      // const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      // this.$api.basic.getProductList(params).then((data) => {
      //   this[tableName].tableData = data;
      //   this[tableName].pagerConfig.total = data.length;
      //   this[tableName].pagerConfig.current = params.page;
      //   this[tableName].pagerConfig.pageSize = params.rows;
      //   this[tableName].editIndex = -1;
      // });
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    sub () {
      console.log(this.form.getFieldsValue());
    },
    changeColor (e, status) {
      if (status === 1) {
        e.currentTarget.style.opacity = '1';
      } else {
        e.currentTarget.style.opacity = '0.5';
      }
    },
    dragControllerDiv () {
      var svgResize = document.getElementById('svgResize');
      var svgTop = document.getElementById('svgTop');
      var svgDown = document.getElementById('svgDown');
      var svgBox = document.getElementById('svgBox');
      svgResize.onmousedown = function (e) {
        var startY = e.clientY;
        svgResize.top = svgResize.offsetTop;
        document.onmousemove = function (e) {
          var endY = e.clientY;
          var moveLen = svgResize.top + (endY - startY);
          var maxT = svgBox.clientHeight - svgResize.offsetHeight;
          if (moveLen < 30) moveLen = 30;
          if (moveLen > maxT - 30) moveLen = maxT - 30;
          svgResize.style.top = moveLen;
          svgTop.style.height = moveLen + 'px';
          svgDown.style.height = (svgBox.clientHeight - moveLen - 5) + 'px';
        };
        document.onmouseup = function (evt) {
          document.onmousemove = null;
          document.onmouseup = null;
          svgResize.releaseCapture && svgResize.releaseCapture();
        };
        svgResize.setCapture && svgResize.setCapture();
        return false;
      };
    },
    onClose () {
      this.$emit('Closed', '', 5);
      this.status = true;
    },
    onSmall () {
      this.small = !this.small;
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

   #svgBox{
    width:100%;
    height:100%;
    position: relative;
    overflow:hidden;
    text-align: center;
    margin: 0 auto
  }
  #svgTop{
    height:calc(30% - 5px);
    width:100%;
    float:left;
    overflow: auto;
    margin:0 auto;
  }

  #svgResize{
    position: relative;
    height:5px;
    width:100%;
    cursor: s-resize;
    float:left;
  }

  #svgDown{
    height:70%;
    width:100%;
    float:left;
    overflow: hidden;
  }

  .readyOnly {
    cursor:text;
    background-color: white;
    color: black
  }

  .marginLeft {
    margin-left: 50px
  }

  .sonButton {
    text-align: right;
   button {
     margin:0 5px 5px 0
   }
 }

 .bottomButton {
    width:100%;
    height:50px;
    border: 2px solid #B5B9A9;
    padding-top:6px;
    position: fixed;
    bottom:0;
    z-index:100;
    background-color: white;
 }
</style>
