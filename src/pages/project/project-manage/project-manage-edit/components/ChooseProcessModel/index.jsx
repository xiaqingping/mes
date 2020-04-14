// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Avatar, Col, Tag, Card, Row, Button, Form, AutoComplete } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import '../../index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import apiprocess from '@/pages/project/api/processModel';
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
      processlist: [],
      selectedIds: [], // 所有被选择的id集合
      selecteditem: [],
    };
  }

  componentDidMount() {
    this.getTableData();
    // const centerScroll = document.getElementById("contentCenter");
    // console.log(centerScroll);
  }

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
      //   processlist: res.rows,
      //   // loading: false,
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

  // 关闭
  handleCancel = () => {
    this.props.onClose();
  };

  // 点击选中
  clickSelect = item => {
    // const list =item.id;
    const { selectedIds, selecteditem } = this.state;
    // console.log(selectedIds);
    let idslist;
    let newSelectedItem;
    if (selectedIds.includes(item.id)) {
      idslist = selectedIds.filter(value => {
        return value !== item.id;
      });
      console.log(idslist);
      newSelectedItem = selecteditem.filter(value => {
        return value !== item.code;
      });
      console.log(newSelectedItem);
    } else {
      const ids = [...selectedIds, item.id];
      idslist = [...new Set(ids)];
      const codeList = [...selecteditem, item];
      newSelectedItem = [...new Set(codeList)];
    }

    this.setState({
      selectedIds: idslist,
      selecteditem: newSelectedItem,
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
    const { selecteditem } = this.state;
    // console.log(selecteditem);
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
            <div style={{ height: '430px', overflow: 'auto' }} id="contentCenter">
              <Row gutter={16} style={{ margin: '0' }}>
                {processlist.map((item, index) => {
                  const newIndex = JSON.parse(JSON.stringify(index));
                  // console.log(index);
                  return (
                    <Col
                      // span={7}
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
                        style={{ width: '300px', padding: '0', height: '170px' }}
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
                        <div style={{ fontSize: '14px', paddingLeft: '20px' }}>{item.describe}</div>
                        {/* <div style={{width:'15px',height:'12px',backgroundColor:'#1890ff',
                          position:'absolute',right:'31px',bottom:'0'}}
                          className={classNames({
                            isSelect: this.state.selectedIds.includes(item.id),
                          })} >
                          <div className="isOk">
                            &nbsp;
                          </div>
                        </div> */}
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
