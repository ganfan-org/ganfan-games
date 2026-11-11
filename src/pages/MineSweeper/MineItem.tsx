import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { MineItem, MineItemStatus, MineSweeperStatus } from '../../types/mine-sweeper';
import { handleMouseEvent } from './MineSweeper.slice';

const colors = {
  1: 'RGBA(66, 80, 190, 1.00)',
  2: 'RGBA(30, 105, 3, 1.00)',
  3: 'RGBA(173, 10, 10, 1.00)',
  4: 'RGBA(0, 0, 133, 1.00)',
  5: 'RGBA(128, 3, 3, 1.00)',
  6: 'RGBA(4, 124, 123, 1.00)',
  7: 'RGBA(172, 5, 7, 1.00)',
  8: 'RGBA(172, 9, 13, 1.00)',
};

export function MineItemComponent({ mine }: { mine: MineItem; x: number; y: number }) {
  const { gameStatus } = useStore(({ mineSweeper }) => mineSweeper);

  /**
   * Two visual states: open or closed
   *
   *
   * All cells appear open when the game ends
   * During play each cell has its own state: open is shown; close or flag renders closed
   *
   * Rendering
   * Cells share the same size,
   * Border styling
   */

  let isOpen = false;
  if (mine.status === MineItemStatus.open) {
    isOpen = true;
  }

  const classes = ['mine-item', isOpen ? 'mine-item-open' : 'mine-item-close'];
  if (mine.is_mine) {
    classes.push('is-mine');
  }
  let text = '';

  if (mine.status === MineItemStatus.open && mine.around_mine_count > 0) {
    text = `${mine.around_mine_count}`;
  }
  if (gameStatus === MineSweeperStatus.init) {
    text = '';
  } else if (gameStatus === MineSweeperStatus.doing) {
    if (mine.status === MineItemStatus.flag) {
      text = '🚩';
    } else if (mine.status === MineItemStatus.open) {
      if (mine.around_mine_count > 0) {
        text = `${mine.around_mine_count}`;
      } else {
        text = '';
      }
    } else {
      // close: nothing rendered
      text = '';
    }
  } else if (gameStatus === MineSweeperStatus.success) {
    // No mine has been opened,
    // All non-mine cells are open
    if (mine.status === MineItemStatus.flag) {
      text = '🚩';
    } else if (mine.is_mine) {
      // text = '🧨';
      // text = '🏴';
      // text = '🏁';
      // text = '🏳️‍🌈';
      text = '😎';
    } else {
      if (mine.around_mine_count > 0) {
        text = `${mine.around_mine_count}`;
      } else {
        text = '';
      }
    }
  } else if (gameStatus === MineSweeperStatus.fail) {
    if (mine.isTippingPoint) {
      text = '❌';
    } else if (mine.status === MineItemStatus.flag) {
      text = '🚩';
      if (mine.is_mine === 0) {
        classes.push('flag-error');
      }
    } else if (mine.is_mine) {
      text = '💣';
    }
  }

  // if (mine.isTippingPoint) {
  //   text = '❌';
  // } else if (mine.status === MineItemStatus.open && mine.count > 0) {
  //   text = `${mine.count}`;
  // }

  // const classes = ['mine-item', isOpen ? 'mine-item-open' : 'mine-item-close'];
  // if (mine.is_mine) {
  //   classes.push('is-mine');
  // }

  return (
    <div
      className={classes.join(' ')}
      onMouseUp={(e) => {
        store.dispatch(handleMouseEvent({ clickIndex: mine.index, button: e.button }));
      }}
    >
      <span style={{ color: colors[text] }}>{text}</span>

      {/* <Tooltip title={`${x}, ${y}, ${mine.index}`}>
        <span style={{ color: colors[text] }}>{text || '.'}</span>
      </Tooltip> */}
    </div>
  );
}
