// 高德逆地址编码
export interface AMapRgeoOptions {
  key: string // 高德Key，必填
  location: string // 经纬度坐标，格式为"经度,纬度"，必填
  poitype?: string // 返回附近POI类型，可选，需extensions为all
  radius?: number // 搜索半径，可选，默认1000米
  extensions?: 'base' | 'all' // 返回结果控制，可选，默认base
  roadlevel?: 0 | 1 // 道路等级，可选，需extensions为all
  sig?: string // 数字签名，可选
  output?: 'JSON' | 'XML' // 返回数据格式类型，可选，默认JSON
  callback?: string // 回调函数，可选，仅output为JSON时有效
  homeorcorp?: 0 | 1 | 2 // 是否优化POI返回顺序，可选，需extensions为all
}
export interface AMapRegeoResponse {
  status: '0' | '1'
  info: string
  regeocode: {
    addressComponent: {
      province: string // 坐标点所在省名称
      city: string // 坐标点所在城市名称
      citycode: string // 城市编码
      district: string // 坐标点所在区
      adcode: string // 行政区编码
      township: string // 坐标点所在乡镇/街道
      towncode: string // 乡镇街道编码
      neighborhood: {
        name: string // 社区名称
        type: string // POI类型
      }
      building: {
        name: string // 建筑名称
        type: string // 类型
      }
      streetNumber: {
        street: string
        number: string
        location: string
        direction: string
        distance: string
        seaArea: string
      }
      businessAreas: Array<{
        location: string
        name: string
        id: string
      }>
    }
    // 实际地址例如："北京市朝阳区阜通东大街|6号院"
    formatted_address: string
    roads: Array<{
      id: string
      name: string
      distance: string
      direction: string
      location: string
    }>
    roadinters: Array<{
      distance: string // 交叉路口到请求坐标的距离，单位：米
      direction: string // 输入点相对路口的方位
      location: string // 路口经纬度坐标
      first_id: string // 第一条道路id
      first_name: string // 第一条道路名称
      second_id: string // 第二条道路id
      second_name: string // 第二条道路名称
    }>
    // POI信息列表，包含POI的id、名称、类型、电话等信息
    pois: Array<{
      id: string // POI的id
      name: string // POI点名称
      type: string // POI类型
      tel: string // 电话
      distance: string // 该POI的中心点到请求坐标的距离，单位：米
      direction: string // 为输入点相对建筑物的方位
      address: string // POI地址信息
      location: string // 坐标点
      businessarea: string // POI所在商圈名称
    }>
    // AOI信息列表，包含AOI的id、名称、区域编码、中心点坐标等信息
    aois: Array<{
      id: string // 所属AOI的id
      name: string // 所属AOI名称
      adcode: string // 所属AOI所在区域编码
      location: string // 所属AOI中心点坐标
      area: string // 所属AOI点面积，单位：平方米
      distance: string // 输入经纬度是否在AOI面之中，0代表在AOI内，其余整数代表距离AOI的距离
      type: string // 所属AOI类型
    }>
  }
}
