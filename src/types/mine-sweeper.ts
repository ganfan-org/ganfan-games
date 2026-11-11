export enum MineSweeperStatus {
  init,
  doing,
  success,
  fail,
}

export enum MineItemStatus {
  // Covered
  close,
  // Open
  open,
  // Flagged
  flag,
  // Question mark
}

export enum ClickButtonType {
  // Left button
  left = 0,
  // Middle button
  middle = 1,
  // Right button
  right = 2,
}
export interface MineItem {
  // Original index of the mine
  id: number;
  // Index after the game starts
  index: number;

  // Whether this cell is a mine
  is_mine: 0 | 1;
  // Detonation point
  isTippingPoint?: boolean;
  // Current state
  status: MineItemStatus;
  // Surrounding mine count
  around_mine_count: number;
  // Total neighbors
  around_count: number;

  // Processed: all surrounding non-mine cells are open
  resolved?: boolean;
}
