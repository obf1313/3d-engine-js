/**
 * @description: 药水预测
 * @author: cnn
 * @createTime: 2021/3/1 11:16
 **/
import React, { useEffect, useState } from 'react';
import { Card, List, Row, Tag, Typography } from 'antd';

interface DosageUse {
  name: string,
  value: string,
  unit: string
}

const DosagePredictPanel = () => {
  const [useList, setUseList] = useState<Array<DosageUse>>([]);
  useEffect(() => {
    getUseList();
  }, []);
  // 获取药水本日用量
  const getUseList = () => {
    const useList: Array<DosageUse> = [{
      name: '氢氧化钠 5%',
      value: '300',
      unit: 'L'
    }, {
      name: '氢氧化钠 5%',
      value: '300',
      unit: 'L'
    }, {
      name: '氢氧化钠 5%',
      value: '300',
      unit: 'L'
    }];
    setUseList(useList);
  };
  return (
    <Card
      title="药水预测用量"
      size="small"
      style={{
        position: 'absolute',
        top: 410,
        left: 10,
        width: 350,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: '#1890ff',
        color: '#fff'
      }}
      bodyStyle={{ height: 300, overflowY: 'auto' }}
      headStyle={{ color: '#fff' }}
    >
      <List
        size="small"
        dataSource={useList}
        renderItem={item => (
          <List.Item>
            <Tag color="blue">{item.name}</Tag>
            <Typography.Text style={{ color: '#fff' }}>{item.value} L</Typography.Text>
          </List.Item>
        )}
      />
    </Card>
  );
};
export default DosagePredictPanel;
