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
      title: formatMessage({ id: 'operation.operatorName' }),
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

  componentDidMount() {
    this.props.onRef(this);
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

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  passData(visible, detailsValue) {
    this.setState({
      visible,
      loading: true,
      list: [],
    });
    this.getData(detailsValue);
  }

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
