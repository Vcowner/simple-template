/*
 * @Author: liaokt
 * @Description: 设备模型特征数据字典
 * @Date: 2025-11-27
 */

/**
 * 包级特征枚举
 */
export enum PacketFeatureType {
  PACKET_SIZE = 'packet_size',
  TCP_WINDOW_SIZE = 'tcp_window_size',
  PORT_NUMBER = 'port_number',
  MAC_ADDRESS = 'mac_address',
  DNS_DOMAIN = 'dns_domain',
  HTTP_RESPONSE = 'http_response'
}

/**
 * 流级特征枚举
 */
export enum FlowFeatureType {
  DATA_FLOW_LENGTH = 'data_flow_length',
  DURATION = 'duration',
  TCP_FLAGS = 'tcp_flags',
  IP_VERSION = 'ip_version'
}

/**
 * 包级特征选项（用于下拉选择）
 */
export const PACKET_FEATURE_OPTIONS = [
  { label: '数据包大小(KB)', value: PacketFeatureType.PACKET_SIZE },
  { label: 'TCP窗口大小(字节)', value: PacketFeatureType.TCP_WINDOW_SIZE },
  { label: '端口号', value: PacketFeatureType.PORT_NUMBER },
  { label: 'MAC地址', value: PacketFeatureType.MAC_ADDRESS },
  { label: 'DNS域名字串', value: PacketFeatureType.DNS_DOMAIN },
  { label: 'HTTP响应报文', value: PacketFeatureType.HTTP_RESPONSE }
]

/**
 * 流级特征选项（用于下拉选择）
 */
export const FLOW_FEATURE_OPTIONS = [
  { label: '数据流长度(KB)', value: FlowFeatureType.DATA_FLOW_LENGTH },
  { label: '持续时间(秒)', value: FlowFeatureType.DURATION },
  { label: 'TCP标记', value: FlowFeatureType.TCP_FLAGS },
  { label: 'IP协议版本', value: FlowFeatureType.IP_VERSION }
]

/**
 * 包级特征字典（用于显示文本映射）
 */
export const PACKET_FEATURE_DICT: Record<PacketFeatureType, string> = {
  [PacketFeatureType.PACKET_SIZE]: '数据包大小(KB)',
  [PacketFeatureType.TCP_WINDOW_SIZE]: 'TCP窗口大小(字节)',
  [PacketFeatureType.PORT_NUMBER]: '端口号',
  [PacketFeatureType.MAC_ADDRESS]: 'MAC地址',
  [PacketFeatureType.DNS_DOMAIN]: 'DNS域名字串',
  [PacketFeatureType.HTTP_RESPONSE]: 'HTTP响应报文'
}

/**
 * 流级特征字典（用于显示文本映射）
 */
export const FLOW_FEATURE_DICT: Record<FlowFeatureType, string> = {
  [FlowFeatureType.DATA_FLOW_LENGTH]: '数据流长度(KB)',
  [FlowFeatureType.DURATION]: '持续时间(秒)',
  [FlowFeatureType.TCP_FLAGS]: 'TCP标记',
  [FlowFeatureType.IP_VERSION]: 'IP协议版本'
}
