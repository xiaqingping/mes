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

  columns = [
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
    // {
    //   title: formatMessage({ id: 'bp.operation.state' }),
    //   dataIndex: 'status',
    //   render(val) {
    //     return <Badge className="addEllipsis"
    //     style={{ width: '80px' }} status={status[val].value} text={status[val].text}/>;
    //   },
    // },
    // {
    //   title: formatMessage({ id: 'bp.operation.verificationRecordNo' }),
    //   dataIndex: 'verifyRecordList',
    //   render(val) {
    //     let data = '';
    //     if (val) {
    //       // eslint-disable-next-line array-callback-return
    //       val.map((item, index) => {
    //           if (item.code) {
    //             if (index < 2) {
    //               data += `${item.code}<br/>`
    //             } else {
    //               data += '……'
    //             }
    //           }
    //         },
    //       )
    //     }
    //     return <span className="addEllipsis"
    //      // eslint-disable-next-line react/no-danger
    //      style={{ width: '80px' }} dangerouslySetInnerHTML={{ __html: data }} />
    //   },
    // },
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
          width="600"
          className="myTables"
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
