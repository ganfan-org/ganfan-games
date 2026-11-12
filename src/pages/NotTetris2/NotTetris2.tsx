import React from 'react';
import { Typography, Button, Card, Space, Tag } from 'antd';
import { LinkOutlined, DownloadOutlined } from '@ant-design/icons';
import { AppShell } from '../../components/AppShell/AppShell';
import './not-tetris2.less';

const { Title, Paragraph, Text } = Typography;

export function NotTetris2() {
  const appStoreUrl = 'https://apps.apple.com/app/nottetris2/id6833025556';
  const sourceUrl = 'https://github.com/Stabyourself/nottetris2';

  return (
    <AppShell title='Not Tetris 2'>
      <div className='not-tetris-hero'>
        <Title>Not Tetris 2</Title>
        <Paragraph className='not-tetris-subtitle'>Physics meets falling blocks. Stack. Cut. Survive.</Paragraph>
        <Space className='not-tetris-actions' size='middle' wrap>
          <Button type='primary' size='large' icon={<DownloadOutlined />} href={appStoreUrl} target='_blank'>
            Download on Mac App Store
          </Button>
          <Button size='large' icon={<LinkOutlined />} href={sourceUrl} target='_blank'>
            View Source
          </Button>
        </Space>
      </div>

      <Card className='not-tetris-card'>
        <Title level={4}>About the Game</Title>
        <Paragraph>
          Not Tetris 2 is a physics-based block-stacking puzzle game with a twist. Unlike traditional falling-block
          games, every piece tumbles, bounces, and settles under real physics. Stack them carefully, cut through the
          pile, and watch chaos unfold.
        </Paragraph>
        <Paragraph>
          Arrow keys move and rotate the falling block. When the pile gets too tall, you're out. Use the cut mechanic to
          slice through pieces and save yourself from a cluttered stack.
        </Paragraph>
      </Card>

      <Card className='not-tetris-card'>
        <Title level={4}>Features</Title>
        <Space direction='vertical' className='not-tetris-features'>
          <Text>• Real physics simulation — blocks rotate, slide, and topple realistically</Text>
          <Text>• Cut through blocks — slice stacked pieces to clear the screen</Text>
          <Text>• Single-player and local two-player modes</Text>
          <Text>• Multiple game modes with different scoring rules</Text>
          <Text>• Retro pixel-art visuals and original soundtrack</Text>
          <Text>• Track your high scores locally</Text>
        </Space>
      </Card>

      <Card className='not-tetris-card'>
        <Title level={4}>Privacy</Title>
        <Paragraph>
          This app does not collect, transmit, or share any user data. No analytics, no tracking, no advertising, no
          third-party SDKs. All game saves are stored locally on your device. The game runs entirely offline.
        </Paragraph>
        <Space wrap>
          <Tag color='green'>No Data Collection</Tag>
          <Tag color='green'>No Tracking</Tag>
          <Tag color='green'>No Ads</Tag>
          <Tag color='green'>Offline</Tag>
        </Space>
      </Card>

      <Card className='not-tetris-card'>
        <Title level={4}>Open Source</Title>
        <Paragraph>
          Released under the WTFPL (Do What The Fuck You Want To Public License). Original code and assets by
          Stabyourself.net. This is a macOS port built with the LÖVE game engine.
        </Paragraph>
        <Button type='link' href={sourceUrl} target='_blank' className='not-tetris-source-link'>
          {sourceUrl}
        </Button>
      </Card>
    </AppShell>
  );
}

export default NotTetris2;
