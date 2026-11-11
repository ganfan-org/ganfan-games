import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { MineSweeperGame } from '../pages/MineSweeper/MineSweeper';
import { NotTetris2 } from '../pages/NotTetris2/NotTetris2';

export function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
