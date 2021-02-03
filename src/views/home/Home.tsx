/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useState } from 'react';
import { Row, Layout, BackTop } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Header } from '@components/index';
import { useHistory } from 'react-router';
import './index.less';

const { Content } = Layout;

interface IProps {
  children?: any
}

const Home = (props: IProps) => {
  const { children } = props;
  const history = useHistory();
  // 如果跳转路由了，则清除 current
  history.listen((location, action) => {
    if (action === 'PUSH') {
      sessionStorage.removeItem('current');
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Row style={{ width: '100%' }}>
      <Content className="content">
        {!loading && children}
      </Content>
    </Row>
  );
};

export default Home;