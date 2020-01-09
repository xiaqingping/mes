import {
  // Badge,
  Form,
  Table,
  Drawer,
} from 'antd';
import * as React from 'react';
import api from '@/api';
// import { formatMessage } from 'umi/locale';
import './style.less';

class Details extends React.Component {
  state = {
    visible: false,
    list: [],
  };

  columns = [
    {
      title: '操作类型属性编号',
      dataIndex: 'code',
      render: text => (
        <div className="addEllipsis" style={{ width: '150px' }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '操作类型属性描述',
      dataIndex: 'describe',
      render: text => (
        <div className="addEllipsis" style={{ width: '150px' }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '操作人名称',
      dataIndex: 'operatorName',
      render: text => (
        <div className="addEllipsis" style={{ width: '100px' }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'operationDate',
      render: text => (
        <div className="addEllipsis" style={{ width: '100px' }} title={text}>
          {text}
        </div>
      ),
    },
  ];

  componentWillReceiveProps(nextProps) {
    const { detailsVisible } = nextProps;
    const { detailsValue } = nextProps;
    this.setState({
      visible: detailsVisible,
    });
    this.getData(detailsValue);
  }

  getData = detailsValue => {
    if (detailsValue) {
      api.operation.getOperationTypeProperty(detailsValue.id, { languageCode: 'CN' }).then(res => {
        // res.map((item, index) => {
        //   res[index].fieldName = formatMessage({ id: item.fieldName });
        // });
        this.setState({
          list: res,
        });
      });
    }
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.props.detailsVisibleClose(false);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { list, visible } = this.state;
    return (
      <div>
        <Drawer
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={visible}
          width="600"
          className="myTables"
        >
          <Table
            dataSource={list}
            rowKey={(record, index) => index}
            columns={this.columns}
            size="small"
            pagination={false}
          />
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Details);
