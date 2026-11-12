import { Action, configureStore } from '@reduxjs/toolkit';
import app from '../App/App.slice';
import mineSweeper from '../pages/MineSweeper/MineSweeper.slice';

const middlewareConfiguration = { serializableCheck: false };

export const store = configureStore({
  reducer: { app, mineSweeper },
  devTools: {
    name: 'Ganfan Games',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
