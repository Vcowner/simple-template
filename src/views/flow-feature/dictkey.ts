/*
 * @Author: liaokt
 * @Description: 流级特征及数据流规则相关字典
 * @Date: 2025-11-26
 */

export enum FlowRuleMetricDimension {
  DATA_FLOW_LENGTH = 'data_flow_length',
  DURATION = 'duration',
  TCP_PROTOCOL = 'tcp_protocol',
  IP_PROTOCOL = 'ip_protocol'
}

export const FLOW_RULE_METRIC_OPTIONS = [
  { label: '数据流长度', value: FlowRuleMetricDimension.DATA_FLOW_LENGTH },
  { label: '持续时间', value: FlowRuleMetricDimension.DURATION },
  { label: 'TCP协议', value: FlowRuleMetricDimension.TCP_PROTOCOL },
  { label: 'IP协议', value: FlowRuleMetricDimension.IP_PROTOCOL }
]

export const FLOW_RULE_METRIC_SEARCH_OPTIONS = [
  { key: FlowRuleMetricDimension.DATA_FLOW_LENGTH, value: '数据流长度' },
  { key: FlowRuleMetricDimension.DURATION, value: '持续时间' },
  { key: FlowRuleMetricDimension.TCP_PROTOCOL, value: 'TCP协议' },
  { key: FlowRuleMetricDimension.IP_PROTOCOL, value: 'IP协议' }
]

export const FLOW_RULE_METRIC_DICT: Record<FlowRuleMetricDimension, string> = {
  [FlowRuleMetricDimension.DATA_FLOW_LENGTH]: '数据流长度',
  [FlowRuleMetricDimension.DURATION]: '持续时间',
  [FlowRuleMetricDimension.TCP_PROTOCOL]: 'TCP协议',
  [FlowRuleMetricDimension.IP_PROTOCOL]: 'IP协议'
}
