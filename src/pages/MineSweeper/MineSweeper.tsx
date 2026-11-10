import React from 'react';
import { login } from '../../services/conduit';
import { dispatchOnCall, store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { loadUserIntoApp } from '../../types/user';
import { MineItem, MineItemStatus, MineSweeperStatus } from '../../types/mine-sweeper';
import { GenericForm } from '../../components/GenericForm/GenericForm';
import { initGame, autoSweepMine, autoSweepMineDoing } from './MineSweeper.slice';
import { ContainerPage } from '../../components/ContainerPage/ContainerPage';

import { MineItemComponent } from './MineItem';
import './mine-sweeper.less';
import { Button, Input, Layout, Typography, Menu, MenuProps, Tag, Divider } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;

export function MineSweeperGame() {
  const { mines_matrix, gameStatus, start_time, mines_actual } = useStoreWithInitializer(
    ({ mineSweeper }) => mineSweeper,
    dispatchOnCall(initGame())
  );

  /**
   * 99个雷
   *
   * 16 * 30 16行 30列
   *
   * 游戏状态：初始态、进行中、成功、失败
   *
   * item
   * 雷区：是雷、不是雷
   * 数字：0，1，2，3，4，5，6，7，8
   * 状态：打开，遮蔽，插旗子
   *
   * 第一次点击时，布雷，点击处肯定不是雷
   *
   *
   * 状态
   */
  //

  let btnText = '😊';
  if (gameStatus === MineSweeperStatus.success) {
    btnText = '😁';
  } else if (gameStatus === MineSweeperStatus.fail) {
    btnText = '🙄';
  }

  let timeText = '';
  if (start_time !== null) {
    timeText = '用时: ';
    timeText += Math.floor((new Date().getTime() - start_time.getTime()) / 1000);
  }

  let flagText = '';
  const flagCount = mines_actual.filter((item) => item.status === MineItemStatus.flag).length;
  flagText = `旗数/雷数: ${flagCount}/99`;

  return (
    <Layout
      style={{
        height: '100vh',
        color: 'rgba(190, 190, 190, 1.00)',
      }}
    >
      <Header
        style={{
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.92)',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          GanFan.Game
        </Text>
        <Divider type='vertical' />
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '14px',
          }}
        >
          扫雷
        </Text>
      </Header>
      <Content className='page-content'>
        <div className='game-container'>
          <div className='mine-sweeper-controller-wrapper wrapper'>
            <div className='mine-sweeper-controller'>
              <div>{flagText}</div>
              <div className='start-btn'>
                <button
                  type='button'
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    lineHeight: '1',
                  }}
                  // shape='circle'
                  // size='large'
                  onClick={() => {
                    store.dispatch(initGame());
                  }}
                >
                  <span style={{ fontSize: '30px' }}>{btnText}</span>
                </button>
              </div>

              <div>{timeText}</div>
            </div>
          </div>
          <div className='mine-sweeper-body-wrapper wrapper' style={{ marginTop: '20px' }}>
            <div className='mine-sweeper-body'>
              {mines_matrix.map((row, x) => {
                return (
                  <div key={row[0].id} className='row' style={{ display: 'flex' }}>
                    {row.map((item, y) => {
                      return <MineItemComponent key={item.id} mine={item} x={x} y={y} />;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            {/* <Button
              onClick={() => {
                store.dispatch(autoSweepMine());
              }}
            >
              半自动扫雷
            </Button> */}

            <Button
              onClick={() => {
                if (gameStatus === MineSweeperStatus.doing) {
                  store.dispatch(autoSweepMineDoing({ trigger: 'btn' }));
                } else {
                  store.dispatch(autoSweepMine());
                }
              }}
            >
              {gameStatus === MineSweeperStatus.doing ? '继续' : '开始'}半自动扫雷
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
