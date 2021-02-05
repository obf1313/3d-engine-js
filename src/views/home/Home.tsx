/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useState } from 'react';
import { Row, Layout } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
// @ts-ignore
import titlePrefix from '@static/images/titlePrefix.png';
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
      <div className="large-header">
        <img src={titlePrefix} alt="标题前缀" height={20} style={{ marginRight: 20 }} />
        中央加药
        <img src={titlePrefix} alt="标题前缀" height={20} style={{ marginLeft: 20, transform: 'rotate(180deg)' }} />
      </div>
      <Content className="content">
        {!loading && children}
      </Content>
    </Row>
  );
};

export default Home;
