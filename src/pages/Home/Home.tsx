import React from 'react';
import { Layout, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './home.less';

const { Header, Content } = Layout;
const { Text } = Typography;

const games = [
  {
    path: '/mine-sweeper',
    name: '扫雷',
    description: '经典 Windows 扫雷 · 16×30 · 99 颗雷',
  },
];

function MiniBoard() {
  return (
    <div className='mini-board'>
      <span className='cell cell-open' />
      <span className='cell' />
      <span className='cell' />
      <span className='cell' />
      <span className='cell cell-flag' />
      <span className='cell' />
      <span className='cell' />
      <span className='cell' />
      <span className='cell' />
    </div>
  );
}

export function Home() {
  return (
    <Layout className='home-page' style={{ height: '100vh' }}>
      <Header className='home-header' style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <Text className='brand'>GanFan.Game</Text>
      </Header>
      <Content className='home-content'>
        <div className='home-container'>
          <div className='home-section-title'>全部游戏</div>
          <div className='game-grid'>
            {games.map(({ path, name, description }) => (
              <Link key={path} to={path} className='game-card'>
                <div className='game-icon'>
                  <MiniBoard />
                </div>
                <div className='game-info'>
                  <div className='game-name'>{name}</div>
                  <div className='game-desc'>{description}</div>
                </div>
                <RightOutlined className='game-arrow' />
              </Link>
            ))}
            <div className='game-card-coming'>更多游戏，敬请期待</div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
