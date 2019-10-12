/** 变更认证资料--个人 */
import React from 'react';
import { Form } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const PersonalForm = Form.create({ name: 'personal_form' })(
  class PersonalForm extends React.Component {
    constructor (props) {
      super(props);
      this.state = {};
    }

    render () {
      return (
        <Form {...formItemLayout}>
             {/* {this.renderPerform()} */}
             {/* <Form.Item label="认证说明">
               {getFieldDecorator('idenText')(<TextArea rows={2}/>)}
             </Form.Item> */}
             <Form.Item label="认证图片">
               {/* {getFieldDecorator('idenImg')(uploadModal)} */}
               132
             </Form.Item>
         </Form>
       )
    }
  },
)
export default PersonalForm;
