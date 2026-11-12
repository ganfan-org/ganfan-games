import React, { ReactNode } from 'react';
import { Divider, Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import ganfanLogo from '../../../public/ganfan_logo.svg';
import './app-shell.less';

const { Header, Content } = Layout;
const { Text } = Typography;

interface AppShellProps {
  title?: string;
  wide?: boolean;
  children: ReactNode;
}

export function AppShell({ title, wide = false, children }: AppShellProps) {
  return (
    <Layout className='app-shell'>
      <Header className='app-header'>
        <div className='app-header-main'>
          <Link to='/' className='app-brand'>
            <img src={ganfanLogo} alt='' className='app-brand-logo' />
            <span>Ganfan Games</span>
          </Link>
          {title && (
            <>
              <Divider type='vertical' className='app-header-divider' />
              <Text className='app-page-title'>{title}</Text>
            </>
          )}
        </div>
        <nav className='app-site-nav' aria-label='Site navigation'>
          <Link to='/' className='app-nav-link app-nav-link-active' aria-current='page'>
            Games
          </Link>
          <a href='https://ganfan.org' className='app-nav-link'>
            Ganfan.org
          </a>
        </nav>
      </Header>
      <Content className='app-content'>
        <div className={wide ? 'app-container app-container-wide' : 'app-container'}>{children}</div>
      </Content>
    </Layout>
  );
}
