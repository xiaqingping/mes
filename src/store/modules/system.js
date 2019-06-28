export default {
  state: {
    // Type
    type: [
      { id: 'GET', name: 'GET' },
      { id: 'POST', name: 'POST' },
      { id: 'DELETE', name: 'DELETE' },
      { id: 'PUT', name: 'PUT' }
    ],
    // 参数类型
    paramType: [
      { id: 1, name: '参数' },
      { id: 2, name: '属性' },
      { id: 3, name: '接口' }
    ],
    // 状态
    status: [
      { id: 0, name: '有效' },
      { id: 1, name: '过期' }
    ],
    // 状态 - 用户管理
    isdel: [
      { id: 0, name: '正常' },
      { id: 1, name: '作废' }
    ],
    // 角色
    roles: [
      { id: 67, name: 'BBI_基因' },
      { id: 56, name: '多肽订单' },
      { id: 53, name: '代理商' },
      { id: 52, name: '客服订单' },
      { id: 51, name: '其他部门' },
      { id: 50, name: '测序审核' },
      { id: 49, name: '测序制单' },
      { id: 48, name: '基因实验' },
      { id: 47, name: '基因审核' },
      { id: 46, name: '基因制单' },
      { id: 45, name: '合成审核' },
      { id: 44, name: '合成制单' },
      { id: 39, name: '销售总监' },
      { id: 38, name: '大区经理' },
      { id: 37, name: '销售经理' },
      { id: 36, name: '销售助理' },
      { id: 35, name: '销售代表' },
      { id: 34, name: '财务' },
      { id: 33, name: '人事' },
      { id: 32, name: '仓库' },
      { id: 5, name: '采购员' },
      { id: 1, name: '系统管理员' }
    ],
    // 大区
    regions: [
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
    // 测序点
    cxPointId: [
      { id: 1, name: '上海测序点x' },
      { id: 2, name: '广州测序点' },
      { id: 3, name: '北京测序点' },
      { id: 4, name: '武汉测序点' },
      { id: 5, name: '成都测序点' },
      { id: 6, name: '昆明测序点' },
      { id: 7, name: '长春测序点' },
      { id: 8, name: '青岛测序点' },
      { id: 9, name: '西安测序点' },
      { id: 10, name: '郑州测序点' },
      { id: 11, name: '南京测序点' }
    ],
    // 仓库
    storageCode: [
      { id: 1002, name: '北京测序' },
      { id: 2100, name: '上海仓' }
    ]
  },
  mutations: {},
  actions: {}
};
