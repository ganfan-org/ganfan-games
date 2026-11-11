import React from 'react';
import { Layout, Typography, Divider, Button, Card, Space, Tag } from 'antd';
import { LinkOutlined, DownloadOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export function NotTetris2() {
  const appStoreUrl = 'https://apps.apple.com/app/nottetris2/id6833025556';
  const sourceUrl = 'https://github.com/Stabyourself/nottetris2';

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f0c29', color: '#e6e6e6' }}>
      <Header
        style={{
          background: 'rgba(255,255,255,0.06)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>GanFan.Game</Text>
        <Divider type='vertical' />
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>Not Tetris 2</Text>
      </Header>
      <Content style={{ padding: '40px 24px', maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title style={{ color: '#fff', fontSize: 48, marginBottom: 8 }}>Not Tetris 2</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18 }}>
            Physics meets falling blocks. Stack. Cut. Survive.
          </Paragraph>
          <Space style={{ marginTop: 24 }}>
            <Button type='primary' size='large' icon={<DownloadOutlined />} href={appStoreUrl} target='_blank'>
              Download on Mac App Store
            </Button>
            <Button size='large' icon={<LinkOutlined />} href={sourceUrl} target='_blank'>
              View Source
            </Button>
          </Space>
        </div>

        <Card
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 24,
          }}
        >
          <Title level={4} style={{ color: '#fff' }}>
            About the Game
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)' }}>
            Not Tetris 2 is a physics-based block-stacking puzzle game with a twist. Unlike traditional falling-block
            games, every piece tumbles, bounces, and settles under real physics. Stack them carefully, cut through the
            pile, and watch chaos unfold.
          </Paragraph>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)' }}>
            Arrow keys move and rotate the falling block. When the pile gets too tall, you're out. Use the cut mechanic
            to slice through pieces and save yourself from a cluttered stack.
          </Paragraph>
        </Card>

        <Card
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 24,
          }}
        >
          <Title level={4} style={{ color: '#fff' }}>
            Features
          </Title>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              • Real physics simulation — blocks rotate, slide, and topple realistically
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              • Cut through blocks — slice stacked pieces to clear the screen
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>• Single-player and local two-player modes</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>• Multiple game modes with different scoring rules</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>• Retro pixel-art visuals and original soundtrack</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>• Track your high scores locally</Text>
          </Space>
        </Card>

        <Card
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 24,
          }}
        >
          <Title level={4} style={{ color: '#fff' }}>
            Privacy
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)' }}>
            This app does not collect, transmit, or share any user data. No analytics, no tracking, no advertising, no
            third-party SDKs. All game saves are stored locally on your device. The game runs entirely offline.
          </Paragraph>
          <Space>
            <Tag color='green'>No Data Collection</Tag>
            <Tag color='green'>No Tracking</Tag>
            <Tag color='green'>No Ads</Tag>
            <Tag color='green'>Offline</Tag>
          </Space>
        </Card>

        <Card
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Title level={4} style={{ color: '#fff' }}>
            Open Source
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)' }}>
            Released under the WTFPL (Do What The Fuck You Want To Public License). Original code and assets by
            Stabyourself.net. This is a macOS port built with the LÖVE game engine.
          </Paragraph>
          <Button type='link' href={sourceUrl} target='_blank' style={{ padding: 0 }}>
            https://github.com/Stabyourself/nottetris2
          </Button>
        </Card>
      </Content>
    </Layout>
  );
}

export default NotTetris2;
