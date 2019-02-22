import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import lazy from '../utils/lazy';

const About = lazy(() => import(/* webpackChunkName: "chunk2" */'../pages/about.jsx'));

export default (
    <Switch key="route2">
      <Route path="/about" component={About}/>
    </Switch>
);