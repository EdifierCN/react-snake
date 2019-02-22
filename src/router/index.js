import React from 'react';
import { Route } from 'react-router-dom';

import Route1 from './route1'
import Route2 from './route2'
import Route3 from './route3'

const routes = [
  Route1,
  Route2,
  Route3
];

export default (
    <div key="root" className="root">
      {routes}
    </div>
);