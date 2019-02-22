import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import lazy from '../utils/lazy';

const Product = lazy(() => import(/* webpackChunkName: "chunk3" */'../pages/product.jsx'));

export default (
    <Switch key="route3">
      <Route path="/product" component={Product}/>
    </Switch>
);