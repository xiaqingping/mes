/** 任务执行记录参数 */
import React, { Component } from 'react';
import { Drawer, List, Form } from 'antd';

class TaskExecRecordParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paramList: '',
    };
  }

  componentDidMount() {
    this.setState({ paramList: this.props.paramList });
  }

  render() {
    const { paramList } = this.state;
    console.log(paramList);
    return (
      <Drawer
        title="参数"
        width={320}
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        123
        {/* <List
            dataSource={paramForData}
            split={false}
            renderItem={item => (
              <List.Item key={item}>
                <Form>
                  {console.log(item)}
                  <ModelType data={item} />
                </Form>
              </List.Item>
            )}
          /> */}
      </Drawer>
    );
  }
}

export default TaskExecRecordParam;
