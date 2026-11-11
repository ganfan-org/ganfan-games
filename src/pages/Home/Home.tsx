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
    name: 'Minesweeper',
    description: 'Classic Windows Minesweeper · 16×30 · 99 mines',
    icon: 'mine',
  },
  {
    path: '/nottetris2',
    name: 'Not Tetris 2',
    description: 'Physics Tetris · real stacking + line clear',
    icon: 'tetris',
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

function MiniTetris() {
  return (
    <div className='mini-tetris'>
      <span className='tblock t-cyan' style={{ gridArea: '1 / 1 / 3 / 2' }} />
      <span className='tblock t-yellow' style={{ gridArea: '1 / 2 / 2 / 4' }} />
      <span className='tblock t-purple' style={{ gridArea: '2 / 2 / 3 / 3' }} />
      <span className='tblock t-pink' style={{ gridArea: '3 / 1 / 4 / 4' }} />
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
          <div className='home-section-title'>All Games</div>
          <div className='game-grid'>
            {games.map(({ path, name, description, icon }) => (
              <Link key={path} to={path} className='game-card'>
                <div className='game-icon'>{icon === 'tetris' ? <MiniTetris /> : <MiniBoard />}</div>
                <div className='game-info'>
                  <div className='game-name'>{name}</div>
                  <div className='game-desc'>{description}</div>
                </div>
                <RightOutlined className='game-arrow' />
              </Link>
            ))}
            <div className='game-card-coming'>More games coming soon</div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default Home;
