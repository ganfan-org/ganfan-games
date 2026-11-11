import { lazy, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home/Home'));
const MineSweeperGame = lazy(() => import('../pages/MineSweeper/MineSweeper'));
const NotTetris2 = lazy(() => import('../pages/NotTetris2/NotTetris2'));

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
        <Switch>
          <Route path='/mine-sweeper'>
            <MineSweeperGame />
          </Route>
          <Route path='/nottetris2'>
            <NotTetris2 />
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
