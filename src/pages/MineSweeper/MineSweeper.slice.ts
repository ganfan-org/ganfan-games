import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MineItem, MineSweeperStatus, MineItemStatus, ClickButtonType } from '../../types/mine-sweeper';
import { chunk, shuffle, findIndex, difference, isEqual } from 'lodash';
import { store } from '../../state/store';

const timeout = 50;

export interface MineSweeperGameState {
  gameStatus: MineSweeperStatus;
  mines_initial: MineItem[];
  mines_actual: MineItem[];
  mines_matrix: MineItem[][];
  start_time: Date | null;
  group_2_1: Map<number, number[][]>;
}

const createInitialState: () => MineSweeperGameState = () => {
  let id = 0;
  const mines_initial: MineItem[] = [];
  for (let i = 0; i < 480; i++) {
    mines_initial[i] = {
      is_mine: id < 99 ? 1 : 0,
      index: id,
      id: id++,
      status: MineItemStatus.close,
      around_mine_count: 0,
      around_count: 8,
    };
  }
  const mines_actual: MineItem[] = [...mines_initial];
  const mines_matrix: MineItem[][] = chunk(mines_actual, 30);

  return {
    gameStatus: MineSweeperStatus.init,
    mines_initial,
    mines_actual,
    mines_matrix,
    start_time: null,
    group_2_1: new Map(),
  };
};

interface AroundItem {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
  item: MineItem;
}

const getAroundItemsFromMatrix = (
  mines: MineItem[][],
  x: number,
  y: number,
  withSelf = false
): AroundItem[] => {
  /**
   * Given the index we know the row and column
   * x = Math.floor(i /30)
   * y = i % 30
   * The 8 neighbors are:
   * (x - 1, y - 1)
   * (x - 1, y)
   * (x - 1, y + 1)
   * (x, y - 1)
   * (x, y + 1)
   * (x + 1, y - 1)
   * (x + 1, y)
   * (x + 1, y + 1)
   *
   * Corner cells have 3 neighbors;
   * Other edge (non-corner) cells have 5
   */
  let results: AroundItem[] = [];
  if ((x === 0 && y === 0) || (x === 0 && y === 29) || (x === 15 && y === 0) || (x === 15 && y === 29)) {
    if (x === 0 && y === 0) {
      results = [
        { x: 0, y: 1, item: mines[x][y + 1] },
        { x: 1, y: 0, item: mines[x + 1][y] },
        { x: 1, y: 1, item: mines[x + 1][y + 1] },
      ];
    } else if (x === 0 && y === 29) {
      results = [
        { x: 0, y: -1, item: mines[x][y - 1] },
        { x: 1, y: -1, item: mines[x + 1][y - 1] },
        { x: 1, y: 0, item: mines[x + 1][y] },
      ];
    } else if (x === 15 && y === 0) {
      results = [
        { x: -1, y: 0, item: mines[x - 1][y] },
        { x: -1, y: 1, item: mines[x - 1][y + 1] },
        { x: 0, y: 1, item: mines[x][y + 1] },
      ];
    } else {
      results = [
        { x: -1, y: -1, item: mines[x - 1][y - 1] },
        { x: -1, y: 0, item: mines[x - 1][y] },
        { x: 0, y: -1, item: mines[x][y - 1] },
      ];
    }
  } else if (x === 0 || x === 15 || y === 0 || y === 29) {
    if (x === 0) {
      results = [
        { x: 0, y: -1, item: mines[x][y - 1] },
        { x: 0, y: 1, item: mines[x][y + 1] },
        { x: 1, y: -1, item: mines[x + 1][y - 1] },
        { x: 1, y: 0, item: mines[x + 1][y] },
        { x: 1, y: 1, item: mines[x + 1][y + 1] },
      ];
    } else if (x === 15) {
      results = [
        { x: -1, y: -1, item: mines[x - 1][y - 1] },
        { x: -1, y: 0, item: mines[x - 1][y] },
        { x: -1, y: 1, item: mines[x - 1][y + 1] },
        { x: 0, y: -1, item: mines[x][y - 1] },
        { x: 0, y: 1, item: mines[x][y + 1] },
      ];
    } else if (y === 0) {
      results = [
        { x: -1, y: 0, item: mines[x - 1][y] },
        { x: -1, y: 1, item: mines[x - 1][y + 1] },
        { x: 0, y: 1, item: mines[x][y + 1] },
        { x: 1, y: 0, item: mines[x + 1][y] },
        { x: 1, y: 1, item: mines[x + 1][y + 1] },
      ];
    } else {
      results = [
        { x: -1, y: -1, item: mines[x - 1][y - 1] },
        { x: -1, y: 0, item: mines[x - 1][y] },
        { x: 0, y: -1, item: mines[x][y - 1] },
        { x: 1, y: -1, item: mines[x + 1][y - 1] },
        { x: 1, y: 0, item: mines[x + 1][y] },
      ];
    }
  } else {
    // Walk the 8 neighbors
    results = [
      { x: -1, y: -1, item: mines[x - 1][y - 1] },
      { x: -1, y: 0, item: mines[x - 1][y] },
      { x: -1, y: 1, item: mines[x - 1][y + 1] },
      { x: 0, y: -1, item: mines[x][y - 1] },
      { x: 0, y: 1, item: mines[x][y + 1] },
      { x: 1, y: -1, item: mines[x + 1][y - 1] },
      { x: 1, y: 0, item: mines[x + 1][y] },
      { x: 1, y: 1, item: mines[x + 1][y + 1] },
    ];
  }

  if (withSelf) {
    results.push({ x: 0, y: 0, item: mines[x][y] });
  }

  return results;
};

const getAroundItemsFromArray = (
  mineArr: MineItem[],
  index: number,
  withSelf = false
): Array<AroundItem & { index: number }> => {
  const mines = chunk(mineArr, 30);
  const x = Math.floor(index / 30);
  const y = index % 30;
  const result = getAroundItemsFromMatrix(mines, x, y, withSelf);
  return result.map((item) => {
    return {
      ...item,
      index: (x + item.x) * 30 + (y + item.y),
    };
  });
};
// Whether two indexes are adjacent
const judgeIsAround = (currentIndex: number, anotherIndex: number): boolean => {
  const x1 = Math.floor(currentIndex / 30);
  const y1 = currentIndex % 30;
  const x2 = Math.floor(anotherIndex / 30);
  const y2 = anotherIndex % 30;
  if (Math.abs(x1 - x2) > 1) return false;
  if (Math.abs(y1 - y2) > 1) return false;

  return true;
};

// Open surrounding area
const openAroundItems = (mineArr: MineItem[], index: number) => {
  if (mineArr[index].around_mine_count === 0) {
    const aroundItems = getAroundItemsFromArray(mineArr, index);
    aroundItems.forEach((item) => {
      if (item.item.status === MineItemStatus.close && item.item.is_mine === 0) {
        item.item.status = MineItemStatus.open;
        const x = Math.floor(index / 30);
        const y = index % 30;
        const itemIndex = (x + item.x) * 30 + (y + item.y);
        openAroundItems(mineArr, itemIndex);
      }
    });
  }

  // const currentItem = mineArr[index];
  // const currentIs0 = currentItem.around_mine_count === 0;
  // const aroundItems = getAroundItemsFromArray(mineArr, index);
  // aroundItems.forEach((item) => {
  //   // if (currentIs0 || item.item.around_mine_count ===0) {}
  //   if ((currentIs0 || item.item.around_mine_count === 0) && item.item.status === MineItemStatus.close && item.item.is_mine === 0) {
  //     item.item.status = MineItemStatus.open;
  //     let x = Math.floor(index / 30);
  //     let y = index % 30;
  //     const itemIndex = (x + item.x) * 30 + (y + item.y);
  //     openAroundItems(mineArr, itemIndex);
  //   }
  // });
};

const slice = createSlice({
  name: 'mineSweeper',
  initialState: createInitialState(),
  reducers: {
    initGame: () => createInitialState(),
    gameSuccess: (state: MineSweeperGameState) => {
      state.gameStatus = MineSweeperStatus.success;
    },
    gameFail: (state: MineSweeperGameState) => {
      state.gameStatus = MineSweeperStatus.fail;
    },
    startGame: (state: MineSweeperGameState, action: PayloadAction<{ clickIndex: number }>) => {
      const clickIndex = action.payload.clickIndex;
      // Shuffle
      const len = state.mines_actual.length;
      state.mines_actual = shuffle(state.mines_actual);

      // If the first click lands on a mine, swap it away.
      // For better UX the first click and its neighbors must be safe.

      const aroundItemsWithSelf = getAroundItemsFromArray(state.mines_actual, clickIndex, true);

      const aroundItemsIsMine = aroundItemsWithSelf.filter((item) => item.item.is_mine);

      let switchIndex = Math.floor(len / 3);
      // console.log("mines around:");
      // aroundItemsIsMine.forEach((item) => {
      //   console.log(item);
      // });
      // console.log('----------');
      aroundItemsIsMine.forEach((item) => {
        // console.log(item);

        for (; switchIndex < len; switchIndex += 3) {
          // console.log(
          //   switchIndex,
          //   Math.floor(switchIndex / 30),
          //   switchIndex % 30,
          //   state.mines_actual[switchIndex].is_mine,
          //   judgeIsAround(clickIndex, switchIndex)
          // );
          if (state.mines_actual[switchIndex].is_mine === 0 && !judgeIsAround(clickIndex, switchIndex)) {
            // Swap with the first non-mine position outside the clicked area
            // console.log("swap", item.index, switchIndex);
            [state.mines_actual[switchIndex], state.mines_actual[item.index]] = [
              state.mines_actual[item.index],
              state.mines_actual[switchIndex],
            ];
            break;
          }
        }
      });

      // Rebuild the matrix
      state.mines_matrix = chunk(state.mines_actual, 30);

      // Iterate all cells
      for (let i = 0; i < len; i++) {
        // Assign index
        const item = state.mines_actual[i];
        item.index = i;

        // Compute the surrounding mine count for each cell
        const x = Math.floor(i / 30);
        const y = i % 30;

        const aroundItems = getAroundItemsFromMatrix(state.mines_matrix, x, y);
        item.around_count = aroundItems.length;
        item.around_mine_count = aroundItems.filter((item) => item.item.is_mine).length;
      }
      state.gameStatus = MineSweeperStatus.doing;
      state.start_time = new Date();

      slice.caseReducers.clickLeft(state, action);
    },
    clickLeft: (state: MineSweeperGameState, action: PayloadAction<{ clickIndex: number }>) => {
      const clickIndex = action.payload.clickIndex;
      const clickItem = state.mines_actual[clickIndex];
      if (clickItem.status !== MineItemStatus.close) {
        // Skip when already open or flagged
        return;
      }
      if (clickItem.is_mine === 1) {
        clickItem.isTippingPoint = true;
        slice.caseReducers.gameFail(state, action);
      }
      // Left click
      clickItem.status = MineItemStatus.open;
      openAroundItems(state.mines_actual, clickIndex);

      state.mines_actual = [...state.mines_actual];
      state.mines_matrix = chunk(state.mines_actual, 30);

      // After each click check whether every non-mine cell is open
      const allOpen = state.mines_actual.every((item) => {
        if (item.is_mine === 0 && item.status === MineItemStatus.open) return true;
        if (item.is_mine === 1 && item.status !== MineItemStatus.open) return true;
      });
      if (allOpen) {
        slice.caseReducers.gameSuccess(state);
      }
    },
    // Open multiple cells
    openMulti: (state: MineSweeperGameState, action: PayloadAction<{ clickIndexes: Array<number> }>) => {
      const clickIndexes = action.payload.clickIndexes;
      for (let i = 0; i < clickIndexes.length; i++) {
        const clickIndex = clickIndexes[i];

        const clickItem = state.mines_actual[clickIndex];

        // Skip when already open or flagged
        if (clickItem.status !== MineItemStatus.close) continue;

        if (clickItem.is_mine === 1) {
          clickItem.isTippingPoint = true;
          store.dispatch(gameFail({ clickIndex }));
          return;
        }

        // Left click
        clickItem.status = MineItemStatus.open;
        openAroundItems(state.mines_actual, clickIndex);
      }

      state.mines_actual = [...state.mines_actual];
      state.mines_matrix = chunk(state.mines_actual, 30);

      // After each click check whether every non-mine cell is open
      const allOpen = state.mines_actual.every((item) => {
        if (item.is_mine === 0 && item.status === MineItemStatus.open) return true;
        if (item.is_mine === 1 && item.status !== MineItemStatus.open) return true;
      });
      if (allOpen) {
        store.dispatch(gameSuccess());
      }
    },
    flagMulti: (state: MineSweeperGameState, action: PayloadAction<{ clickIndexes: Array<number> }>) => {
      const clickIndexes = action.payload.clickIndexes;
      for (let i = 0; i < clickIndexes.length; i++) {
        const clickIndex = clickIndexes[i];
        const clickItem = state.mines_actual[clickIndex];
        // Skip when already open or flagged
        if (clickItem.status !== MineItemStatus.close) continue;
        // Place flag
        clickItem.status = MineItemStatus.flag;
      }

      state.mines_actual = [...state.mines_actual];
      state.mines_matrix = chunk(state.mines_actual, 30);
    },
    clickRight: (state: MineSweeperGameState, action: PayloadAction<{ clickIndex: number }>) => {
      // Toggle flag on/off
      // console.log(action);
      const clickIndex = action.payload.clickIndex;
      const clickItem = state.mines_actual[clickIndex];

      if (clickItem.status === MineItemStatus.close) {
        clickItem.status = MineItemStatus.flag;
      } else if (clickItem.status === MineItemStatus.flag) {
        clickItem.status = MineItemStatus.close;
      } else if (clickItem.status === MineItemStatus.open) {
        // Right-click on an open cell behaves like a middle click
        slice.caseReducers.clickMiddle(state, action);
      }

      state.mines_actual = [...state.mines_actual];
      state.mines_matrix = chunk(state.mines_actual, 30);
    },
    clickMiddle: (state: MineSweeperGameState, action: PayloadAction<{ clickIndex: number }>) => {
      // Check whether surrounding flag count matches the cell number
      // If matched, open the unflagged neighbors
      const clickIndex = action.payload.clickIndex;
      const clickItem = state.mines_actual[clickIndex];
      if (clickItem.status !== MineItemStatus.open) return;
      if (clickItem.around_mine_count === 0) return;

      const aroundItems = getAroundItemsFromArray(state.mines_actual, clickIndex);
      const flagCount = aroundItems.filter((item) => item.item.status === MineItemStatus.flag).length;
      if (flagCount !== clickItem.around_mine_count) {
        // TODO flash the cell to give the user a hint
        return;
      }
      // Open unflagged neighbors
      const aroundItemsClose = aroundItems.filter((item) => item.item.status === MineItemStatus.close);
      for (let i = 0; i < aroundItemsClose.length; i++) {
        slice.caseReducers.clickLeft(state, {
          type: 'mineSweeper/clickLeft',
          payload: { clickIndex: aroundItemsClose[i].index },
        });
      }
    },
    handleMouseEvent: (
      state: MineSweeperGameState,
      action: PayloadAction<{ clickIndex: number; button: ClickButtonType }>
    ) => {
      const gameStatus = state.gameStatus;
      const { button } = action.payload;

      if (gameStatus === MineSweeperStatus.fail || gameStatus === MineSweeperStatus.success) {
        return;
      }
      if (gameStatus === MineSweeperStatus.init) {
        if (button === 0) {
          // Left click starts the game
          slice.caseReducers.startGame(state, action);
        }
        // Other buttons are ignored
        return;
      }
      if (button === ClickButtonType.left) {
        slice.caseReducers.clickLeft(state, action);
      } else if (button === ClickButtonType.middle) {
        slice.caseReducers.clickMiddle(state, action);
      } else if (button === ClickButtonType.right) {
        slice.caseReducers.clickRight(state, action);
      }

      // Click
    },

    /**
     * Auto sweep
     * Reset the game, click the center cell, then start sweeping
     */
    autoSweepMine: (state: MineSweeperGameState) => {
      state = createInitialState();

      setTimeout(() => {
        // Opening move
        store.dispatch(handleMouseEvent({ clickIndex: 30 * 7 + 15, button: ClickButtonType.left }));

        setTimeout(() => {
          /**
           * Iterate and place flags
           * Step by step
           */
          store.dispatch(autoSweepMineDoing());
        }, timeout);
      });

      return state;
    },

    autoSweepMineDoing: (state: MineSweeperGameState) => {
      // Bail out if the game has already ended
      if (state.gameStatus !== MineSweeperStatus.doing) return;

      // Auto-sweep, currently round-by-round
      // Whether any processing happened this round; one action per round then continue
      let isProcessing = false;
      let isPreProcessing = false; // Preprocessing is the first inference step; no cell is opened or flagged yet

      for (let clickIndex = 0; clickIndex < 30 * 16; clickIndex++) {
        const clickItem = state.mines_actual[clickIndex];
        if (clickItem.resolved || clickItem.status !== MineItemStatus.open || clickItem.around_mine_count === 0) {
          // We infer from revealed numbers
          // Only revealed cells are processed; closed or flagged cells are skipped
          continue;
        }
        const aroundCount = clickItem.around_count;
        const aroundItems = getAroundItemsFromArray(state.mines_actual, clickIndex);
        if (aroundCount != aroundItems.length) {
          return;
        }
        let aroundFlagCount = 0;
        let aroundOpenCount = 0;
        let aroundCloseCount = 0;
        const aroundMineCount = clickItem.around_mine_count;

        for (let i = 0; i < aroundItems.length; i++) {
          const item = aroundItems[i];
          if (item.item.status === MineItemStatus.flag) {
            aroundFlagCount++;
          } else if (item.item.status === MineItemStatus.open) {
            aroundOpenCount++;
          } else if (item.item.status === MineItemStatus.close) {
            aroundCloseCount++;
          }
        }

        if (aroundFlagCount === aroundMineCount) {
          // flag count equals mine count
          if (aroundOpenCount < aroundCount - aroundMineCount) {
            // Some cells still closed: opened < total - mines (flagged)
            // Middle-click to open
            isProcessing = true;
            setTimeout(() => {
              store.dispatch(handleMouseEvent({ clickIndex: clickIndex, button: ClickButtonType.middle }));
              setTimeout(() => {
                store.dispatch(autoSweepMineDoing());
              }, timeout);
            }, timeout);
          } else {
            // Everything open, nothing to do
            clickItem.resolved = true;
          }
        } else if (aroundFlagCount < aroundMineCount) {
          // flag count < mine count
          if (aroundOpenCount === aroundCount - aroundMineCount) {
            // opened == total - mines: remaining closed cells are mines, flag them
            aroundItems.forEach((item) => {
              if (item.item.status === MineItemStatus.close) {
                item.item.status = MineItemStatus.flag;
              }
            });
            isProcessing = true;
            setTimeout(() => {
              store.dispatch(autoSweepMineDoing());
            }, timeout);
          } else {
            // Otherwise opened < total - mines: need inference

            // console.log(current(clickItem));

            // m choose n
            // Neighbors still closed and unflagged
            const maybeCount = aroundCloseCount;
            // Surrounding unflagged mine count
            const maybeMineCount = aroundMineCount - aroundFlagCount;

            /**
             * Case 1
             * flag + close > mine count
             * close count is 2, mine count - flag count is 1
             * A 2-of-1 situation
             */
            if (maybeCount === 2 && maybeMineCount === 1) {
              const indexes = aroundItems
                .filter((item) => item.item.status === MineItemStatus.close)
                .map((item) => item.index)
                .sort((a, b) => a - b);
              indexes.forEach((index) => {
                const others = state.group_2_1.get(index);
                if (others === undefined) {
                  state.group_2_1.set(index, [indexes]);
                  isPreProcessing = true;
                } else {
                  if (findIndex(others, (o) => isEqual(o, indexes)) === -1) {
                    others.push(indexes);
                    isPreProcessing = true;
                  }
                }
              });
              // console.log(state.group_2_1.entries());
            } else if (maybeMineCount === 1 || maybeCount - maybeMineCount === 1) {
              // For 3-of-1, check if a 2-of-1 subset exists
              // If a pair is 2-of-1, the third cell is safe

              const closeItems = aroundItems.filter((item) => item.item.status === MineItemStatus.close);
              const closeItemsIndexes = closeItems.map((item) => item.index);
              // console.log(`1111 clickIndex${clickIndex} maybeCount${maybeCount} maybeMineCount${maybeMineCount} closeItemsIndexes ${closeItemsIndexes}`);
              for (let j = 0; j < closeItems.length; j++) {
                // console.log(closeItems.filter((item, index) => index !== j).map((item) => current(item.item.group_2_1)))
                const indexes_arr = state.group_2_1.get(closeItems[j].index);
                // console.log('1122', j, indexes_arr)
                if (indexes_arr === undefined) continue;

                const indexes = indexes_arr.find((indexes) => {
                  // Every element of indexes is contained in closeItemsIndexes
                  return difference(indexes, closeItemsIndexes).length === 0;
                });
                if (!indexes) {
                  // console.log('2222', clickIndex, closeItemsIndexes, closeItems[j].index, indexes_arr);
                  continue;
                }

                // These two are a pair
                // The other index is empty
                const otherIndexes = difference(closeItemsIndexes, indexes);
                isProcessing = true;

                const ifOtherIndexIsMine = maybeMineCount === 1 ? false : true;
                // console.log('3333', clickIndex, closeItemsIndexes, closeItems[j].index, indexes_arr, otherIndexes);

                setTimeout(() => {
                  if (ifOtherIndexIsMine) {
                    store.dispatch(flagMulti({ clickIndexes: otherIndexes }));
                  } else {
                    store.dispatch(openMulti({ clickIndexes: otherIndexes }));
                  }
                  setTimeout(() => {
                    store.dispatch(autoSweepMineDoing());
                  }, timeout);
                }, timeout);
                break;
              }
            }
          }
        }

        if (isProcessing) {
          break;
        }
      }
      if (!isProcessing && isPreProcessing) {
        // If nothing processed but we have preprocessing, trigger another pass
        setTimeout(() => {
          store.dispatch(autoSweepMineDoing());
        }, timeout);
      }

      if (!isProcessing && !isPreProcessing) {
        // Neither processed nor preprocessed this round; algorithm is stuck, waiting for user
      }

      state.mines_actual = [...state.mines_actual];
      state.mines_matrix = chunk(state.mines_actual, 30);

      return state;
    },
  },
});

const { gameFail, gameSuccess, openMulti, flagMulti } = slice.actions;
export const { initGame, handleMouseEvent, autoSweepMine, autoSweepMineDoing } = slice.actions;

export default slice.reducer;
