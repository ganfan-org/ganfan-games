import React from 'react';
import { dispatchOnCall, store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { MineItemStatus, MineSweeperStatus } from '../../types/mine-sweeper';
import { initGame, autoSweepMine, autoSweepMineDoing } from './MineSweeper.slice';
import { MineItemComponent } from './MineItem';
import './mine-sweeper.less';
import { Button } from 'antd';
import { AppShell } from '../../components/AppShell/AppShell';

export function MineSweeperGame() {
  const { mines_matrix, gameStatus, start_time, mines_actual } = useStoreWithInitializer(
    ({ mineSweeper }) => mineSweeper,
    dispatchOnCall(initGame())
  );

  /**
   * Board: 99 mines on a 16-row × 30-column grid.
   * Game states: init → doing → success | fail.
   * Cell states: covered / open / flagged.
   * First click never lands on a mine.
   */

  let btnText = '😊';
  if (gameStatus === MineSweeperStatus.success) {
    btnText = '😁';
  } else if (gameStatus === MineSweeperStatus.fail) {
    btnText = '🙄';
  }

  let timeText = '';
  if (start_time !== null) {
    timeText = 'Time: ';
    timeText += Math.floor((new Date().getTime() - start_time.getTime()) / 1000);
  }

  let flagText = '';
  const flagCount = mines_actual.filter((item) => item.status === MineItemStatus.flag).length;
  flagText = `Flags/Mines: ${flagCount}/99`;

  return (
    <AppShell title='Minesweeper' wide>
      <div className='mine-sweeper-game'>
        <div className='mine-sweeper-scroll'>
          <div className='mine-sweeper-content'>
            <div className='mine-sweeper-controller-wrapper wrapper'>
              <div className='mine-sweeper-controller'>
                <div>{flagText}</div>
                <div className='start-btn'>
                  <button
                    type='button'
                    onClick={() => {
                      store.dispatch(initGame());
                    }}
                  >
                    <span>{btnText}</span>
                  </button>
                </div>
                <div>{timeText}</div>
              </div>
            </div>
            <div className='mine-sweeper-body-wrapper wrapper'>
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
          </div>
        </div>
        <div className='mine-sweeper-actions'>
          <Button
            onClick={() => {
              if (gameStatus === MineSweeperStatus.doing) {
                store.dispatch(autoSweepMineDoing());
              } else {
                store.dispatch(autoSweepMine());
              }
            }}
          >
            {gameStatus === MineSweeperStatus.doing ? 'Resume' : 'Start'} auto-sweep
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

export default MineSweeperGame;
