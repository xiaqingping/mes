import React from 'react';
import { Input, Form, Button, Switch } from 'antd';

/**
 * 多选 配置页面
 */

// 排序
function compare(property) {
  // eslint-disable-next-line func-names
  return function(a, b) {
    const value1 = a[property];
    const value2 = b[property];
    return value1 - value2;
  };
}

class CheckboxModel extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    console.log(nextProps.viewForm);
    return {
      formData: nextProps.viewForm,
      fromView: nextProps.fromView,
    };
  }

  state = {
    // 选项列表
    selectList: [
      {
        id: 1,
        selectName: '选项 1',
        selectKey: 'select_1',
      },
      {
        id: 2,
        selectName: '选项 2',
        selectKey: 'select_2',
      },
    ],
    // 表单数据
    formData: null,
    // 表单查看
    fromView: null,
    // 查看状态
    viewStatus: false,
  };

  componentDidUpdate(props) {
    if (this.props.viewForm !== props.viewForm) {
      this.getFromData(this.props.viewForm);
    }
  }

  /**
   * 获取表单数据渲染表单
   * @param {Object} formData 表单数据
   */
  getFromData = formData => {
    let viewData = [];
    if (formData.paramKey) {
      const newData = [];
      Object.keys(formData).forEach(key => {
        if (key.indexOf('select') !== -1) {
          newData.push({ [key]: formData[key] });
        }
      });
      const data = [];
      newData.forEach(item => {
        let selectKey;
        Object.keys(item).forEach(key => {
          selectKey = key;
        });
        const obj = JSON.parse(item[selectKey]);
        const id = selectKey.split('_')[1];

        const newItem = {
          id: Number(id),
          selectKey,
          selectName: `选项_${id}`,
          selectValue: obj.selectValue,
        };
        data.push(newItem);
        const nData = data.sort(compare('id'));
        console.log(nData);

        viewData = nData;
      });
    } else {
      viewData = this.state.selectList;
    }

    // 是否为查看状态
    let viewStatus = false;
    if (this.props.fromView) viewStatus = true;

    this.setState({ selectList: viewData, viewStatus });
    return viewData;
  };

  /**
   * 新增选项
   */
  addSelected = () => {
    const { selectList } = this.state;
    const ids = [];
    selectList.forEach(item => ids.push(item.id));
    const max = Math.max.apply(null, ids);
    const newId = max + 1;
    const newName = `选项 ${newId}`;
    const newKey = `select_${newId}`;

    const data = {
      id: newId,
      selectName: newName,
      selectKey: newKey,
    };
    const optionList = this.state.selectList;
    this.setState({
      selectList: [...optionList, data],
    });

    return [...optionList, data];
  };

  render() {
    const { fromView, selectList, formData, viewStatus } = this.state;
    return (
      <>
        <Form.Item
          label="参数Key："
          name="paramKey"
          rules={[
            {
              required: true,
              message: '请输入参数Key',
            },
          ]}
        >
          {viewStatus ? <span>{formData.paramKey}</span> : <Input placeholder="请输入参数名称 " />}
        </Form.Item>

        <Form.Item
          label="参数描述："
          name="paramName"
          rules={[
            {
              required: true,
              message: '请输入参数描述',
            },
          ]}
        >
          {viewStatus ? <span>{formData.paramName}</span> : <Input placeholder="请输入参数描述" />}
        </Form.Item>

        <Form.Item label="是否必填：" name="isRequired">
          {viewStatus ? formData.isRequired : <Switch defaultChecked />}
        </Form.Item>

        <p style={{ fontSize: 16, fontWeight: 'bold' }}>选项：</p>

        {selectList.map(item => (
          <>
            <div style={{ width: 370, overflow: 'hidden' }}>
              <div style={{ float: 'left', marginRight: '10px', height: '40px' }}>
                <span style={{ position: 'relative', left: 0, top: 5 }}>{item.selectName} :</span>
              </div>
              <div style={{ float: 'right', width: 300, height: '40px', paddingTop: '4px' }}>
                {viewStatus ? (
                  <div>
                    <span>{item.selectKey}</span>
                    <span style={{ marginLeft: 20 }}>{item.selectValue}</span>
                  </div>
                ) : (
                  <Form.Item label="" name={item.selectKey}>
                    <Input.Group compact>
                      <Form.Item
                        name={[[item.selectKey], 'selectKey']}
                        noStyle
                        rules={[{ required: true, message: '请输入Key' }]}
                      >
                        <Input style={{ width: '50%' }} placeholder="请输入Key" />
                      </Form.Item>
                      <Form.Item
                        name={[[item.selectKey], 'selectValue']}
                        noStyle
                        rules={[{ required: true, message: '请输入名称' }]}
                      >
                        <Input style={{ width: '50%' }} placeholder="请输入名称" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                )}
              </div>
            </div>
          </>
        ))}

        {!fromView && (
          <Button type="dashed" block style={{ marginTop: 30 }} onClick={() => this.addSelected()}>
            新增
          </Button>
        )}
      </>
    );
  }
}

export default CheckboxModel;
