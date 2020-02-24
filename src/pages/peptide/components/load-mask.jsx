// 编辑收货地址
import { Input, Modal, Button, Icon, Typography } from 'antd';
import React, { Component } from 'react';

const { TextArea } = Input;
const { Text } = Typography;

class Load extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    visible: false,
    val: '',
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  visibleShow = visible => {
    this.setState({
      visible,
    });
  };

  handleOk = () => {
    const { val } = this.state;
    if (val) {
      this.props.getData(val);
      this.handleCancel();
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  getVal = e => {
    this.setState({
      val: e.target.value,
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { visible } = this.state;
    return (
      <Modal
        title="批量导入序列"
        width="800px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        style={{ marginTop: '80px' }}
        footer={[
          <Button key="submit" onClick={this.handleOk}>
            <Icon type="save" />
            保存
          </Button>,
        ]}
      >
        <Text style={{ margin: '0' }}>
          多肽名称，提供总量（mg），是否脱盐（是或否），纯度（%），多肽序列，分装管数。支持逗号。
        </Text>
        <TextArea
          rows={6}
          style={{ resize: 'none' }}
          placeholder="一行一个序列。如：P1，50，是，30，ASDFGWERQ，2"
          onChange={e => {
            this.getVal(e);
          }}
        />
      </Modal>
    );
  }
}

export default Load;
