import React from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import routes from '../router/index'

import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import TodoList from '../containers/TodoList'
import UndoRedo from '../containers/UndoRedo'
import Counter from '../containers/Counter'

const router = [routes];

class App extends React.Component {
  render() {
    return (
        <div className="app">
          <h1>Counter</h1>
          <Counter />
          <h1>TODO</h1>
          <div>
            <AddTodo />
            <TodoList />
            <Footer />
            <UndoRedo />
          </div>
          <h1>App</h1>
          <ul>
            <li><Link to="/home">home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/product">Product</Link></li>
          </ul>
          {router}
        </div>
    );
  }
}


export default App;