import ReactDOM from 'react-dom';
import { App } from './App/App';
document.oncontextmenu = function () {
  return false;
};
ReactDOM.render(<App />, document.getElementById('root'));
