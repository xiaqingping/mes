export default {
  state: {
    // Type
    type: [
      // { id: '', name: '全部' },
      { id: 'GET', name: 'GET' },
      { id: 'POST', name: 'POST' },
      { id: 'DELETE', name: 'DELETE' },
      { id: 'PUT', name: 'PUT' }
    ],
    // 参数类型
    paramType: [
      // { id: '', name: '全部' },
      { id: 1, name: '参数' },
      { id: 2, name: '属性' },
      { id: 3, name: '接口' }
    ],
    // 状态
    status: [
      { id: 0, name: '有效' },
      { id: 1, name: '无效' }
    ],
    // 角色
    roles: [
      { id: '', name: '全部' },
      { id: 22, name: 'BBI_基因' },
      { id: 2, name: '多肽订单' },
      { id: 3, name: '代理商' },
      { id: 4, name: '客服订单' },
      { id: 5, name: '其他部门' },
      { id: 6, name: '测序审核' },
      { id: 7, name: '测序制单' },
      { id: 8, name: '基因实验' },
      { id: 9, name: '基因审核' },
      { id: 10, name: '基因制单' },
      { id: 11, name: '合成审核' },
      { id: 12, name: '合成制单' },
      { id: 13, name: '销售总监' },
      { id: 14, name: '大区经理' },
      { id: 15, name: '销售经理' },
      { id: 16, name: '销售助理' },
      { id: 17, name: '销售代表' },
      { id: 18, name: '财务' },
      { id: 19, name: '人事' },
      { id: 20, name: '仓库' },
      { id: 21, name: '采购员' },
      { id: 1, name: '系统管理员' }
    ],
    // 大区
    regions: [
      { id: 0, name: '全部' },
      { id: 1000, name: '华北大区' },
      { id: 2000, name: '东北大区' },
      { id: 2200, name: '香港大区' },
      { id: 3100, name: '总部大区' },
      { id: 3110, name: '华东一区' },
      { id: 3120, name: '华东二区' },
      { id: 3130, name: '华东三区' },
      { id: 3210, name: '加拿大国内大区' },
      { id: 3220, name: '加拿大国外大区' },
      { id: 3300, name: '美国大区' },
      { id: 3500, name: '英国大区' },
      { id: 4000, name: '华南一区' },
      { id: 4010, name: '华南二区' },
      { id: 5000, name: '西南大区' },
      { id: 6000, name: '西北大区' },
      { id: 7000, name: '华中大区' },
      { id: 8000, name: '北京大区' },
      { id: 9000, name: '上海大区' }
    ],
    // 网点
    offices: [
      { id: 0, name: '全部' },
      { id: 100, name: '北京' },
      { id: 101, name: '广州' },
      { id: 102, name: '武汉' },
      { id: 103, name: '上海' },
      { id: 104, name: '天津' },
      { id: 105, name: '石家庄' },
      { id: 106, name: '扬州' },
      { id: 107, name: '太原' },
      { id: 108, name: '呼和浩特' },
      { id: 109, name: '沈阳' },
      { id: 110, name: '哈尔滨' },
      { id: 111, name: '长春' },
      { id: 112, name: '大连' },
      { id: 114, name: '苏州' },
      { id: 115, name: '无锡' },
      { id: 116, name: '南京' },
      { id: 117, name: '徐州' },
      { id: 118, name: '杭州' },
      { id: 119, name: '宁波' },
      { id: 120, name: '温州' },
      { id: 121, name: '福州' },
      { id: 122, name: '厦门' },
      { id: 123, name: '安徽' },
      { id: 124, name: '南昌' },
      { id: 125, name: '济南' },
      { id: 126, name: '青岛' },
      { id: 127, name: '南宁' },
      { id: 129, name: '海口' },
      { id: 131, name: '深圳' },
      { id: 133, name: '成都' },
      { id: 134, name: '重庆' },
      { id: 135, name: '贵阳' },
      { id: 136, name: '昆明' },
      { id: 137, name: '西安' },
      { id: 138, name: '兰州' },
      { id: 141, name: '乌鲁木齐' },
      { id: 142, name: '郑州' },
      { id: 143, name: '长沙' },
      { id: 144, name: '青海' },
      { id: 201, name: '加拿大国内' },
      { id: 299, name: '加拿大海外' },
      { id: 301, name: '美国' },
      { id: 401, name: '香港' },
      { id: 501, name: '英国' },
      { id: 998, name: '总部-国际' },
      { id: 999, name: '总部-国内' }
    ],
    // 状态 - 用户管理
    isdel: [
      { id: '', name: '全部' },
      { id: 0, name: '正常' },
      { id: 1, name: '作废' }
    ]
  },
  mutations: {},
  actions: {}
};
