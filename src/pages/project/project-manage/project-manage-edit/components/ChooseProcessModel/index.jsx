// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Avatar, Col, Tag, Card, Row, Button, Form, AutoComplete, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import TableSearchForm from '@/components/TableSearchForm';
import '../../index.less';
import './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import _ from 'lodash';
import api from '@/pages/project/api/processModel';
import disk from '@/pages/project/api/disk';
import xuanzhong from '@/assets/imgs/xuanzhong.png';
import DefaultHeadPicture from '@/assets/imgs/upload_middle.png';
import ChooseProcessModelCheck from '../ChooseProcessModelCheck';

const FormItem = Form.Item;

// 选择流程模型模态框
class ChooseProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      nameCodeVal: [],
      viewvisible: false,
      processlist: [], // 流程模型数据
      selectedIds: [], // 所有被选择的id集合
      selecteditem: [], // 所有被选择的item数据的集合
      processCode: '',
      hasMore: true, // 是否开启下拉加载
      page: 1,
      rows: 9,
      // allListNum: 0, // 下拉加载
    };

    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
  }

  /**
   * 渲染页面时调用
   *getTableData 获取表格数据的方法名
   */
  componentDidMount() {
    this.getTableData();
  }

  // 异步验证做节流处理的方法
  callParter = value => {
    api.getProcessCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';

    const { processCode, page, rows } = this.state;
    let newData = [];
    let changePage = false;

    if (formData.code) {
      changePage = true;
      newData = { ...newData, code: processCode };
      delete formData.code;
    }
    const newPage = changePage ? { page: 1 } : page;

    const data = {
      page,
      rows,
      status: 2,
      ...formData,
      ...options,
      ...newData,
      ...newPage,
    };

    api.getProcess(data).then(res => {
      this.setHasMore(res.total);
      this.setState({
        processlist: res.rows,
        rows: rows + 2,
        // allListNum: res.total,
      });
    });
  };

  /**
   * 搜索条件
   * @param  {string} nameCodeVal 模糊搜索获取到的数据
   */
  simpleForm = () => {
    const { languageCode } = this.props;
    const { nameCodeVal } = this.state;
    return (
      <>
        <Col xxl={8} lg={languageCode === 'EN' ? 12 : 8}>
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

  // 选中联想框的值的方法
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
    });
    return true;
  };

  // 关闭模态框的方法
  handleCancel = () => {
    this.props.onClose();
  };

  /**
   * 点击选中流程模型的方法
   * @param {Object} idsList 存储已选中的流程模型的id
   * @param {Array} processModelList 存储已选中的流程模型的整条数据
   * @param {Object} selectedIds 选中的流程模型的id
   * @param {Array} selecteditem 选中的流程模型的整条数据
   */
  clickSelect = item => {
    const { selectedIds, selecteditem } = this.state;

    const itemlist = item.id;
    if (!selectedIds.includes(itemlist)) {
      const idsList = [...selectedIds, itemlist];
      const processModelList = [...selecteditem, item];

      this.setState({
        selectedIds: idsList,
        selecteditem: processModelList,
      },() => {
        console.log(selecteditem)
      });
    }
    if (selectedIds.includes(itemlist)) {
      const newidsList = selectedIds.filter(value => value !== itemlist);
      const newProcessModelList = selecteditem.filter(value => value.id !== itemlist);

      this.setState({
        selectedIds: newidsList,
        selecteditem: newProcessModelList,
      });
    }
  };

  /**
   * 点击查看流程模型下的任务模型
   * @param {Array} viewlist 存储的流程模型的数据
   * @param {string} viewvisible 控制任务模型的模态框是否弹出
   */
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

  /**
   * 点击确定保存数据
   * @param {Array} selecteditem 所有被选择的流程模型数据的集合
   * @param onClose 关闭流程模型弹框的方法
   */
  handleOk = () => {
    const { selecteditem } = this.state;
    this.props.getData(selecteditem);
    this.props.onClose();
  };

  // 点击关闭关联
  viewClose = () => {
    this.setState({
      viewvisible: false,
    });
  };

  /**
   * 设置禁止加载
   * @param {Int} num 加载的总数量
   */
  setHasMore = num => {
    const { processlist } = this.state;
    if (num === processlist.length) {
      this.setState({
        hasMore: false,
      });
    }
  };

  render() {
    const { viewvisible, processlist, viewlist, hasMore } = this.state;
    return (
      <Card bordered={false}>
        <div>
          <Modal
            title="选择流程模型"
            className="classChooseProcessModel"
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
              <InfiniteScroll
                initialLoad={false} // 不让它进入直接加载
                pageStart={1} // 设置初始化请求的页数
                loadMore={this.getTableData}
                hasMore={hasMore} // 是否继续监听滚动事件 true 监听 | false 不再监听
                useWindow={false} // 为true就是窗口滚动，false是dom滚动
              >
                <Row gutter={16} style={{ margin: '0' }}>
                  {processlist.map(item => (
                    <Col
                      style={{
                        padding: '0',
                        marginBottom: '10px',
                        marginRight: '10px',
                        width: '300px',
                      }}
                      span={8}
                      // eslint-disable-next-line react/no-array-index-key
                      key={item.id}
                    >
                      <Card.Grid
                        style={{
                          width: '300px',
                          height: '170px',
                          padding:'0',
                          paddingLeft:'24px'
                          // boxShadow: '1px 1px 10px #ccc',
                        }}
                        bordered={false}
                        onClick={() => this.clickSelect(item)}
                        className={classNames({
                          isSelect: this.state.selectedIds.includes(item.id),
                        })}
                      >
                        <div
                          style={{
                            height: '80px',
                            paddingTop: '10px',
                          }}
                        >
                          <Avatar
                            src={
                              item.picture
                                ? disk.downloadFiles(item.picture, { view: true })
                                : DefaultHeadPicture
                            }
                            style={{
                              float: 'left',
                              marginRight: '10px',
                              width: '60px',
                              height: '60px',
                            }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '80px',
                              width: '120px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li style={{ textAlign: 'left', marginBottom: '3px' }}>
                                {item.name}
                              </li>
                              <li style={{ textAlign: 'left' }}>
                                <Tag
                                  color="green"
                                  style={{
                                    width: '50px',
                                    height: '20px',
                                    textAlign: 'center',
                                    lineHeight: '18px',
                                  }}
                                >
                                  {item.version}
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float:'right',
                              paddingRight:'5px'
                            }}
                            className="isView"
                          >
                            <Button
                              style={{ border: '0', color: '#108ee9' }}
                              onClick={() => this.viewModal(item)}
                            >
                              查看
                            </Button>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            paddingTop: '10px',
                            paddingRight:'24px',
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.describe}
                        </div>
                        <div
                          style={{ display: 'none' }}
                          className={classNames({
                            isOk: this.state.selectedIds.includes(item.id),
                          })}
                        >
                          <img
                            src={xuanzhong}
                            alt=""
                            style={{ position: 'absolute', right: '0', bottom: '0' }}
                          />
                        </div>
                      </Card.Grid>
                    </Col>
                  ))}
                </Row>
                {hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
              </InfiniteScroll>
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
