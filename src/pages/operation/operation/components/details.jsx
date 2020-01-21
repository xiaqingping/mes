import { Empty, Form, Table, Drawer } from 'antd';
import * as React from 'react';
import api from '@/api';
import { formatMessage } from 'umi/locale';
import './style.less';

class Details extends React.Component {
  state = {
    visible: false,
    list: [],
    err: false,
    loading: true,
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  getData = detailsValue => {
    if (detailsValue) {
      api.operation
        .getOperationItems(detailsValue.id, { languageCode: 'CN' })
        .then(res => {
          // res.map((item, index) => {
          //   res[index].fieldName = formatMessage({ id: item.fieldName });
          //   return null;
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
    const columns = [
      {
        title: formatMessage({ id: 'operation.actionTypePropertyDescription' }),
        dataIndex: 'operationTypePropertyDescribe',
        render: text => (
          <div className="addEllipsis" style={{ width: '200px' }} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'bp.operation.newValue' }),
        dataIndex: 'newValue',
        render: text => (
          <div className="addEllipsis" style={{ width: '100px' }} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'bp.operation.oldValue' }),
        dataIndex: 'oldValue',
        render: text => (
          <div className="addEllipsis" style={{ width: '100px' }} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'bp.operation.keyword' }),
        dataIndex: 'keyword',
        render: text => (
          <div className="addEllipsis" style={{ width: '100px' }} title={text}>
            {text}
          </div>
        ),
      },
    ];
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
          {err ? (
            <Empty />
          ) : (
            <Table
              dataSource={list}
              rowKey={(record, index) => index}
              columns={columns}
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
