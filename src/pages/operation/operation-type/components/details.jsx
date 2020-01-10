import { Empty, Form, Table, Drawer } from 'antd';
import * as React from 'react';
import api from '@/api';
import { formatMessage } from 'umi/locale';
import './style.less';

class Details extends React.Component {
  state = {
    visible: false,
    loading: true,
    list: [],
    err: false,
  };

  columns = [
    {
      title: formatMessage({ id: 'operation.operationType.actionTypePropertyNumber' }),
      dataIndex: 'code',
      render: text => (
        <div className="addEllipsis" style={{ width: '150px' }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'operation.actionTypePropertyDescription' }),
      dataIndex: 'describe',
      render: text => (
        <div className="addEllipsis" style={{ width: '150px' }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'operation.actionTypePropertyDescription' }),
      dataIndex: 'operatorName',
      render: text => (
        <div className="addEllipsis" style={{ width: '150px' }} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'operation.operationTime' }),
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
      loading: true,
      list: [],
    });
    this.getData(detailsValue);
  }

  getData = detailsValue => {
    if (detailsValue) {
      api.operation
        .getOperationTypeProperty(detailsValue.id, { languageCode: 'CN' })
        .then(res => {
          // res.map((item, index) => {
          //   res[index].fieldName = formatMessage({ id: item.fieldName });
          // });
          this.setState({
            list: res,
            loading: false,
          });
        })
        .catch(() => {
          this.setState({
            err: true,
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
    const { list, visible, loading, err } = this.state;
    return (
      <div>
        <Drawer
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={visible}
          width="650"
          className="myTables"
          destroyOnClose
        >
          {err ? (
            <Empty />
          ) : (
            <Table
              dataSource={list}
              rowKey={(record, index) => index}
              columns={this.columns}
              loading={loading}
              size="small"
              pagination={false}
            />
          )}
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Details);
