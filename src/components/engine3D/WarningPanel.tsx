/**
 * @description: 设备预警
 * @author: cnn
 * @createTime: 2021/3/1 11:21
 **/
import React, { useEffect, useState } from 'react';
import { Card, List, Row, Tag, Typography } from 'antd';

interface PushResult {
  pushWay: string,
  pushResultMsg: string
}

interface WarnLog {
  id: string,
  deviceCode: string,
  deviceName: string,
  value: string,
  updateTime: string,
  rule: string,
  warnLogPushResultVOList: Array<PushResult>
}

const WarningPanel = () => {
  const [warnLogList, setWarnLogList] = useState<Array<WarnLog>>([]);
  useEffect(() => {
    getWarnLogList();
  }, []);
  // 获取设备预警列表
  const getWarnLogList = () => {
    const warnLogList: Array<WarnLog> = [{
      id: '22',
      deviceCode: '222',
      deviceName: '一楼_xx生产线_液位流量计',
      value: '800',
      updateTime: '2020-09-25 08:22:23',
      rule: 'A值超过500',
      warnLogPushResultVOList: []
    }, {
      id: '222',
      deviceCode: '222',
      deviceName: '一楼_xx生产线_液位流量计',
      value: '800',
      updateTime: '2020-09-25 08:22:23',
      rule: 'A值超过500',
      warnLogPushResultVOList: []
    }];
    setWarnLogList(warnLogList);
  };
  return (
    <Card
      title="设备预警监控"
      size="small"
      style={{
        position: 'absolute',
        top: 60,
        right: 10,
        width: 400,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: '#1890ff',
        color: '#fff'
      }}
      bodyStyle={{ height: 600, overflowY: 'auto' }}
      headStyle={{ color: '#fff' }}
    >
      <List
        size="small"
        dataSource={warnLogList}
        renderItem={item => (
          <List.Item>
            <Row justify="space-between" align="middle">
              <Tag color="blue">{item.value}</Tag>
              <Row style={{ flexDirection: 'column' }}>
                <Tag color="blue">{item.deviceName}</Tag>
                <Typography.Text style={{ color: '#fff' }}>{item.rule}</Typography.Text>
              </Row>
              <Typography.Text style={{ color: '#fff' }}>{item.updateTime}</Typography.Text>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );
};
export default WarningPanel;
