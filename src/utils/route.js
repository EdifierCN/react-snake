// abort
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

const RouteWithSubRoutes = route => (
     <Route
         path={route.path}
         render={props => (
             route.redirect
                 ? (<Redirect to={route.redirect}/>)
                 : (<route.component {...props} routes={route.routes} />)
         )}
     />
 );

const RouteGroup = props => (
      <Switch>
          {props.routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route}/>
          ))}
      </Switch>
  );

export {
  RouteGroup,
  RouteWithSubRoutes
}