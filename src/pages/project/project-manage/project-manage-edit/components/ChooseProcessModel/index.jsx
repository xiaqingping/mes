// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Avatar, Col, Tag, Card, Row, Button, Form, AutoComplete } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import '../../index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import _ from 'lodash';
import api from '@/pages/project/api/processModel';
import disk from '@/pages/project/api/disk';
import ChooseProcessModelCheck from '../ChooseProcessModelCheck';

const FormItem = Form.Item;

// 选择流程模型模态框
class ChooseProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  constructor(props) {
    // console.log(props);
    super(props);

    this.state = {
      pagination: {},
      // loading: false,
      nameCodeVal: [],
      viewvisible: false,
      processlist: [], // 流程模型数据
      selectedIds: [], // 所有被选择的id集合
      selecteditem: [], // 所有被选择的item数据的集合
      processCode: '',
    };

    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData();
  }

  callParter = value => {
    api.getProcessCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    // this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    console.log(formData);

    const { pagination, processCode } = this.state;
    const { current: page, pageSize: rows } = pagination;
    console.log(processCode);
    let newData = [];
    let changePage = false;

    if (formData.code) {
      changePage = true;
      newData = { ...newData, code: processCode };
      console.log(newData);
      console.log(changePage);
      delete formData.code;
    }
    const newPage = changePage ? { page: 1 } : page;
    console.log(newPage);

    const data = {
      page,
      rows,
      ...formData,
      ...options,
      ...newData,
      ...newPage,
    };

    api.getProcess(data).then(res => {
      // console.log(res);
      const uuids = res.rows.map(e => e.picture);
      // console.log(uuids);
      disk
        .getFiles({
          sourceCode: uuids.join(','),
          sourceKey: 'project_process_model',
        })
        .then(v => {
          if (v) {
            const newList = res.rows.map(e => {
              const filterItem = v.filter(item => item.sourceCode === e.picture);
              // console.log(v);
              const fileId = filterItem[0] && filterItem[0].id;
              return {
                ...e,
                fileId,
              };
            });
            // console.log(newList);
            this.setState({
              processlist: newList,
            });
          } else {
            const newList = res.rows.map(e => {
              const fileId = '';
              return {
                ...e,
                fileId,
              };
            });
            this.setState({
              processlist: newList,
            });
          }
        });

      // this.setState({
      //   // processlist: res.rows,
      //   loading: false,
      // });
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
              style={{ width: '200px' }}
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
    code: item.code,
    value: item.name,
    label: (
      <div
        style={{ display: 'flex', marginLeft: '14px', padding: '6px 0' }}
        onClick={() => {
          this.setState({
            processCode: item.code,
          });
        }}
      >
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    ),
  });

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
      if (item.name.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeVal: arr,
      // allowClear: 'ture',
    });
    console.log(nameCodeVal);
    return true;
  };

  // 关闭
  handleCancel = () => {
    this.props.onClose();
  };

  // 点击选中
  clickSelect = item => {
    console.log(item);
    // const list =item.id;
    const { selectedIds, selecteditem } = this.state;
    console.log(this.state);

    const itemlist = item.id;
    if (!selectedIds.includes(itemlist)) {
      console.log('you');

      const idsList = [...selectedIds, itemlist];
      const codeList = [...selecteditem, item];
      console.log(idsList);
      console.log(codeList);

      this.setState(
        {
          selectedIds: idsList,
          selecteditem: codeList,
        },
        () => {
          console.log(this.state);
        },
      );
    }
    if (selectedIds.includes(itemlist)) {
      const newidsList = selectedIds.filter(value => {
        return value !== itemlist;
      });
      console.log(newidsList);
      // console.log('筛选值');
      const newcodeList = selecteditem.filter(value => {
        return value.id !== itemlist;
      });
      console.log(newcodeList);

      this.setState(
        {
          selectedIds: newidsList,
          selecteditem: newcodeList,
        },
        () => {
          console.log(this.state);
        },
      );
    }
  };

  // 查看
  viewModal = item => {
    api.getProcessDetail(item.id).then(res => {
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
    const { selecteditem } = this.state;
    console.log(selecteditem);
    this.props.getData(selecteditem);

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
    // console.log(this.state);
    return (
      <Card bordered={false}>
        <div>
          <Modal
            title="选择流程模型"
            visible={this.props.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={1050}
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
            <div style={{ height: '430px', overflow: 'auto', padding: '5px' }} id="contentCenter">
              <Row gutter={16} style={{ margin: '0' }}>
                {processlist.map((item, index) => {
                  const newIndex = JSON.parse(JSON.stringify(index));
                  return (
                    <Col
                      style={{
                        padding: '0',
                        marginBottom: '10px',
                        marginRight: '10px',
                        width: '300px',
                      }}
                      // eslint-disable-next-line react/no-array-index-key
                      key={newIndex}
                      // key={index}
                    >
                      <Card.Grid
                        style={{
                          width: '300px',
                          padding: '0',
                          height: '170px',
                          boxShadow: '1px 1px 10px #ccc',
                        }}
                        onClick={() => this.clickSelect(item)}
                        className={classNames({
                          isSelect: this.state.selectedIds.includes(item.id),
                        })}
                      >
                        <div
                          style={{
                            height: '80px',
                            width: '300px',
                            paddingTop: '10px',
                            marginBottom: '15px',
                          }}
                        >
                          <Avatar
                            src={item.fileId ? disk.downloadFiles(item.fileId, { view: true }) : ''}
                            style={{
                              float: 'left',
                              marginRight: '10px',
                              marginLeft: '20px',
                              width: '60px',
                              height: '60px',
                            }}
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
                            className="isView"
                          >
                            <Button
                              style={{ border: '0', color: '#005bc3' }}
                              onClick={() => this.viewModal(item)}
                            >
                              查看
                            </Button>
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', paddingLeft: '20px' }}>{item.describe}</div>
                        <div className="isOk" />
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
