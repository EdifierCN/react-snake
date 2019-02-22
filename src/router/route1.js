import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import lazy from '../utils/lazy';

const Book = lazy(() => import(/* webpackChunkName: "chunk1" */'../pages/book.jsx'));
const Home = lazy(() => import(/* webpackChunkName: "chunk1" */'../pages/home.jsx'));

export default (
    <Switch key="route1">
      <Route path="/home" component={Home}/>
      <Route path="/book/id/:id" component={Book}/>
    </Switch>
);