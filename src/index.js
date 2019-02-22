import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import App from './components/App.jsx';

// 使用指定的 React Redux 组件 <Provider> 来 魔法般的 让所有容器组件都可以访问 store，而不必显示地传递它
render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root'));

registerServiceWorker();



// import { normalize, schema } from 'normalizr';

// const originalData = {
//   "id": "123",
//   "author": {
//     "id": "1",
//     "name": "Paul"
//   },
//   "title": "My awesome blog post",
//   "comments": [
//     {
//       "id": "324",
//       "commenter": {
//         "id": "2",
//         "name": "Nicole"
//       }
//     },
//     {
//       "id": "333",
//       "commenter": {
//         "id": "5",
//         "name": "Jack"
//       }
//     }
//   ]
// };
//
// // Define a users schema
// const user = new schema.Entity('users');
//
// // Define your comments schema
// const comment = new schema.Entity('comments', {
//   commenter: user
// });
//
// // Define your article
// const article = new schema.Entity('articles', {
//   author: user,
//   comments: [comment]
// });
//
// const normalizedData = normalize(originalData, article);
//
// console.info(originalData);
// console.info(normalizedData);