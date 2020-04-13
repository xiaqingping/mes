// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Avatar, Col, Tag, Card, Row, Button, Form, AutoComplete } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import '../../index.less';
import _ from 'lodash';
import classNames from 'classnames';
// import router from 'umi/router';

// import api from '@/pages/project/api/projectManage';
import { connect } from 'dva';
import apiprocess from '@/pages/project/api/processModel';
// import { isDate } from 'moment';
import ChooseProcessModelCheck from '../ChooseProcessModelCheck';
// import apitask from '@/pages/project/api/taskmodel';

const FormItem = Form.Item;

// 选择流程模型模态框
class ChooseProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  // static getDerivedStateFromProps(nextProps) {
  //   return {
  //     idslist: nextProps.idslist || [],
  //   }
  // }

  // 顶部表单默认值
  // initialValues = {
  //   page: 1,
  //   rows: 18,
  // };

  constructor(props) {
    // console.log(props);
    super(props);

    this.state = {
      pagination: {},
      // loading: false,
      nameCodeVal: [],
      viewvisible: false,
      processlist: [],
      selectedIds: [], // 所有被选择的id集合
      selectedCode: [],
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData();
  }

  callParter = value => {
    apiprocess.getProcessCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const formData =
      this.tableSearchFormRef.current && this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;

    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };

    apiprocess.getProcess(data).then(res => {
      this.setState({
        processlist: res.rows,
        // loading: false,
      });
    });
  };

  simpleForm = () => {
    const { languageCode } = this.props;
    const { nameCodeVal } = this.state;
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="流程模型" name="code">
            <AutoComplete
              style={{ width: '260px' }}
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  // 流程模型选择样式
  renderOption = item => ({
    value: item.code,
    label: (
      <div style={{ display: 'flex', marginLeft: '14px', padding: '6px 0' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    ),
  });

  // 流程模型筛选值
  inputValue = value => {
    const { nameCodeVal } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callParter(value);
    if (nameCodeVal.length === 0) {
      return false;
    }
    nameCodeVal.forEach(item => {
      if (item.name.indexOf(value) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeVal: arr,
    });
    return true;
  };

  // 关闭
  handleCancel = () => {
    this.props.onClose();
  };

  // 点击选中
  clickSelect = item => {
    const { selectedIds, selectedCode } = this.state;
    const ids = [...selectedIds, item.id];
    const idslist = [...new Set(ids)];

    const codeList = [...selectedCode, item];
    const newCodeList = [...new Set(codeList)];
    // console.log(newCodeList);

    this.setState({
      selectedIds: idslist,
      selectedCode: newCodeList,
    });
  };

  // 查看
  viewModal = item => {
    apiprocess.getProcessDetail(item.id).then(res => {
      this.setState({
        viewlist: res,
      });
    });
    this.setState({
      viewvisible: true,
      viewlist: item,
    });
  };

  // 点击确定保存数据
  handleOk = () => {
    const { selectedCode } = this.state;
    this.props.getData(selectedCode);

    this.props.onClose();
  };

  // 点击关闭关联
  viewClose = () => {
    this.setState({
      viewvisible: false,
    });
  };

  render() {
    const { viewvisible, processlist, viewlist } = this.state;
    return (
      <Card bordered={false}>
        <div>
          <Modal
            title="选择流程模型"
            visible={this.props.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={1200}
          >
            <div className="tableList">
              <Card bordered={false}>
                <TableSearchForm
                  ref={this.tableSearchFormRef}
                  initialValues={this.initialValues}
                  getTableData={this.getTableData}
                  simpleForm={this.simpleForm}
                />
              </Card>
            </div>
            <div style={{ height: '430px', overflow: 'auto' }}>
              <Row gutter={16} style={{ margin: '0' }}>
                {processlist.map((item, index) => {
                  return (
                    <Col
                      span={7}
                      style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                    >
                      <Card.Grid
                        style={{ width: '300px', padding: '0' }}
                        onClick={() => this.clickSelect(item)}
                        className={classNames({
                          isSelect: this.state.selectedIds.includes(item.id),
                        })}
                      >
                        <div style={{ height: '80px', width: '300px', padding: '5px' }}>
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{ float: 'left', marginRight: '10px' }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '50px',
                              width: '120px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li>{item.name}</li>
                              <li>
                                <Tag color="green" style={{ width: '50px', height: '20px' }}>
                                  {item.version}
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float: 'right',
                              color: '#005bc3',
                              marginRight: '10px',
                            }}
                          >
                            <Button
                              onClick={() => this.viewModal(item)}
                              style={{ border: '0', color: '#005bc3' }}
                              // onMouseEnter={this.MouseEnter(this)}
                              // onMouseLeave={this.MouseLeave(this)}
                            >
                              查看
                            </Button>
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', padding: '10px' }}>{item.describe}</div>
                      </Card.Grid>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Modal>
          <ChooseProcessModelCheck
            visible={viewvisible}
            onClose={this.viewClose}
            viewlist={viewlist}
          />
        </div>
      </Card>
    );
  }
}

export default connect(({ global, projectManage }) => ({
  languageCode: global.languageCode,
  projectManage,
}))(ChooseProcessModel);
