import React from 'react';
import { Input, Form, Button, Switch } from 'antd';

/**
 * 多选 配置页面
 */

class CheckboxModel extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return {
      viewForm: nextProps.viewForm,
      fromView: nextProps.fromView,
    };
  }

  state = {
    list: [],
    viewForm: null,
    fromView: null,
  };

  componentDidMount() {
    const { fromView, viewForm } = this.props;
    if (fromView) {
      const viewData = [];
      Object.keys(viewForm).forEach(key => {
        if (key.indexOf('select') !== -1) {
          viewData.push({ [key]: viewForm[key] });
        }
      });

      this.setState({
        list: viewData,
      });
    } else {
      const originList = [
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
      ];
      this.setState({
        list: originList,
      });
    }
  }

  getList = () => {
    const { fromView, viewForm } = this.props;
    if (fromView) {
      let viewData = [];
      Object.keys(viewForm).forEach(key => {
        if (key.indexOf('select') !== -1) {
          viewData.push({ [key]: viewForm[key] });
        }
      });
      viewData = this.sortListData(viewData);
      return viewData;
    }
    return true;
  };

  setData = data => {
    const newData = JSON.parse(JSON.stringify(data));
    Object.keys(data).map(key => {
      newData[key] = JSON.parse(data[key]);
      return true;
    });
    return newData;
  };

  addSelected = () => {
    const { list } = this.state;
    const ids = [];
    list.forEach(item => ids.push(item.id));
    const max = Math.max.apply(null, ids);
    const newId = max + 1;
    const newName = `选项 ${newId}`;
    const newKey = `select_${newId}`;

    const data = {
      id: newId,
      selectName: newName,
      selectKey: newKey,
    };
    const optionList = this.state.list;
    this.setState({
      list: [...optionList, data],
    });
  };

  sortListData = data => {
    const propertyArr = [];
    const mapSelect = new Map();

    data.forEach(item => {
      Object.keys(item).forEach(key => {
        propertyArr.push(key);
        mapSelect.set(key, item);
      });
    });

    propertyArr.sort();

    const result = [];

    propertyArr.forEach(p => {
      result.push(mapSelect.get(p));
    });

    return result;
  };

  render() {
    const { fromView, viewForm, list } = this.state;
    const listData = fromView ? this.getList() : list;
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
          {fromView ? <span>{viewForm.paramKey}</span> : <Input placeholder="请输入参数名称 " />}
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
          {fromView ? <span>{viewForm.paramName}</span> : <Input placeholder="请输入参数描述" />}
        </Form.Item>

        <Form.Item label="是否必填：" name="isRequired">
          {/* <Switch /> */}
          {fromView ? viewForm.isRequired : <Switch defaultChecked />}
        </Form.Item>

        <p style={{ fontSize: 16, fontWeight: 'bold' }}>选项：</p>
        {(listData || []).map((item, index) => {
          let fieldName;
          let lebel;
          if (fromView) {
            item = this.setData(item);
            fieldName = Object.keys(item)[0];
            const num = fieldName.split('_')[1];
            lebel = `选项 ${num}`;
          }
          return (
            <>
              {fromView ? (
                <div style={{ width: 500, overflow: 'hidden' }}>
                  <div style={{ float: 'left' }}>
                    <span style={{ position: 'relative', left: 0, top: 5 }}>{lebel} :</span>
                  </div>
                  <div style={{ float: 'right', marginRight: 50, width: 380 }}>
                    <Form.Item label="" name={item.selectKey} key={index}>
                      <Input.Group compact>
                        <Form.Item
                          name={[[fieldName], 'selectKey']}
                          noStyle
                          rules={[{ required: true, message: '请输入Key' }]}
                        >
                          <span style={{ width: 130, marginRight: 10 }}>
                            {item[fieldName].selectKey}
                          </span>
                        </Form.Item>
                        <Form.Item
                          name={[[fieldName], 'selectValue']}
                          noStyle
                          rules={[{ required: true, message: '请输入名称' }]}
                        >
                          <span style={{ width: 130 }}>{item[fieldName].selectValue}</span>
                          {/* <Input style={{ width: '50%' }} placeholder="请输入名称" /> */}
                          {/* {fromView ? (
                        <span>{item[fieldName].selectValue}</span>
                      ) : (
                        <Input style={{ width: '50%' }} placeholder="请输入Key" />
                      )} */}
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                  </div>
                </div>
              ) : (
                <div style={{ width: 500, overflow: 'hidden' }}>
                  <div style={{ float: 'left' }}>
                    <span style={{ position: 'relative', left: 0, top: 5 }}>
                      {item.selectName} :
                    </span>
                  </div>
                  <div style={{ float: 'right', marginRight: 50, width: 380 }}>
                    <Form.Item label="" name={item.selectKey}>
                      <Input.Group compact>
                        <Form.Item
                          name={[[item.selectKey], 'selectKey']}
                          noStyle
                          rules={[{ required: true, message: '请输入Key' }]}
                        >
                          <Input style={{ width: '50%' }} placeholder="请输入Key" />
                          {/* {fromView ? (
                      <span>{viewForm.paramKey}</span>
                    ) : (
                        <Input style={{ width: '50%' }} placeholder="请输入Key" />
                    )} */}
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
                  </div>
                </div>
              )}
            </>
          );
        })}

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
