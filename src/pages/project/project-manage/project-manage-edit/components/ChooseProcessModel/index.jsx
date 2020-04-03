// 点击选择流程模型的模态框
import React from 'react';
import {
  Modal,
  // Table,
  //  Avatar,
  //  Form,
  //  Input,
  //  Select,
  //  Col,
  //  Card,
  //  Tag,
  //  Popconfirm
} from 'antd';
// import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';

// const FormItem = Form.Item;
// const { Option } = Select;

class ChooseProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  // state = { visible: false,};

  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  // titleContent = () => <div style={{ fontSize: '16px' }}>关联任务模型</div>;
  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  // handleOk = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // };

  // handleCancel = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // };

  // getTableData = (options = {}) => {

  //   const data = this.props.processModel.processModelData;
  //   this.setState({
  //     // list: data,
  //     // pagination: {
  //     //   current: options.page,
  //     //   pageSize: options.rows,
  //     //   total: data.total,
  //     // },
  //     // loading: false,
  //   });
  //   // console.log(this.props.project.projectManage);
  // };

  // simpleForm = () => (
  //   <>
  //     <Col lg={8}>
  //       <FormItem label="状态" name="publisher">
  //         <Select>
  //           <Option value="jack">Jack</Option>
  //           <Option value="lucy">Lucy</Option>
  //         </Select>
  //       </FormItem>
  //     </Col>
  //   </>
  // );

  render() {
    const { onClose } = this.props;
    // const { list, loading, pagination } = this.state;
    // const { pagination } = this.state;

    return (
      // <Modal
      //   title={this.titleContent()}
      //   visible={this.state.visible}
      //   onOk={this.handleOk}
      //   onCancel={onClose}
      //   width={747}
      // >
      //   <div className="tableList">
      //     <Table
      //       columns={columns}
      //       dataSource={list}
      //       loading={loading}
      //       rowKey="id"
      //       size="small"
      //       pagination={pagination}
      //     />
      //   </div>
      // </Modal>
      <Modal
        title="Title"
        // visible={visible}
        onOk={this.handleOk}
        onCancel={onClose}
        width={747}
        // confirmLoading={confirmLoading}
        // onCancel={this.handleCancel}
      >
        {/* <p>{ModalText}</p> */}
      </Modal>
    );
  }
}

export default connect(({ global, processModel }) => ({
  languageCode: global.languageCode,
  processModel,
}))(ChooseProcessModel);
