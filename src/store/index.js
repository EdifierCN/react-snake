import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { reducers as store1 } from './store1'
import { reducers as store2, selectSubreddit, fetchPosts, fetchPostsIfNeeded } from './store2'
// import { reducers as store3 } from './store3'
import { reducers as store4, rootSaga as ormSaga } from './store4'
import { reducers as store5, rootSaga as counterSaga } from './store5'

const rootReducer = combineReducers({
    store1,
    store2,
    store4,
    store5
});

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({collapsed: true});

const store = createStore(rootReducer,
      applyMiddleware(
      thunkMiddleware, // 允许我们 dispatch() 函数
      sagaMiddleware, // saga
      // loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
    ));

sagaMiddleware.run(counterSaga);
sagaMiddleware.run(ormSaga);

store.dispatch(selectSubreddit('reactjs'));
store
    .dispatch(fetchPosts('reactjs'))
    .then(() => console.log()
    );
store
    .dispatch(fetchPostsIfNeeded('reactjs'))
    .then(() => console.log()
    );

// dispatch 一个 action 以创建一个 Post 实例
store.dispatch({
  type : "CREATE_POST",
  payload : {
    postId: 1,
    userId: 1,
    userName: 'Jack',
    title: 'posts_1',
    content: 'posts_1_content'
  }
});

store.dispatch({
  type : "CREATE_POST",
  payload : {
    postId: 2,
    userId: 3,
    userName: 'Dom',
    title: 'posts_2',
    content: 'posts_2_content'
  }
});

store.dispatch({
  type : "CREATE_POST",
  payload : {
    postId: 3,
    userId: 1,
    userName: 'Jack',
    title: 'posts_3',
    content: 'posts_3_content'
  }
});

store.dispatch({
  type : "CREATE_POST",
  payload : {
    postId: 4,
    userId: 1,
    userName: 'Jack',
    title: 'posts_4',
    content: 'posts_4_content'
  }
});

// dispath 一个 action 以创建一个 Comment 实例作为上个 Post 的子元素
store.dispatch({
  type : "ADD_COMMENT",
  payload : {
    commentId: 1,
    postId: 1,
    userId: 2,
    userName: 'Zack',
    content: 'posts_1_comment_content_1'
  }
});

store.dispatch({
  type : "ADD_COMMENT",
  payload : {
    commentId: 2,
    postId: 1,
    userId: 3,
    userName: 'Dom',
    content: 'posts_1_comment_content_2'
  }
});

store.dispatch({
  type : "ADD_COMMENT",
  payload : {
    commentId: 3,
    postId: 2,
    userId: 3,
    userName: 'Dom',
    content: 'posts_2_comment_content_3'
  }
});

const action = type => store.dispatch({type});
action('REQUEST_POST');

setTimeout(() => {
  console.log(store.getState());
}, 4000);



export default store



// es6 默认参数和 createStore的preloadState，优先使用preloadState

// 使用 Redux 的一个益处就是它让 state 的变化过程变的可预知和透明。
// 每当一个 action 发起完成后，新的 state 就会被计算并保存下来。State 不能被自身修改，只能由特定的 action 引起变化。

// 关于reducer
//  每个 reducer 只负责管理全局 state 中它负责的一部分。每个 reducer 的 state 参数都不同，分别对应它管理的那部分 state 数据。
// combineReducers() 所做的只是生成一个函数，这个函数来调用你的一系列 reducer，每个 reducer 根据它们的 key 来筛选出 state 中的一部分数据并处理，然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象。

// 关于mapStateToProps/mapDispatchToProps
// 容器组件就是使用 store.subscribe() 从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件
// mapStateToProps: 订阅store的状态改变，在每次store的state发生变化的时候，都会被调用
// mapDispatchToProps: ownProps 组件自身的props（当prop发生变化的时候，mapStateToProps也会被调用）
// 注意：如果 connect 的 mapStateToProps 返回的不是一个对象而是一个函数，他将被用做为每个容器的实例创建一个单独的 mapStateToProps 函数。

// 关于bindActionCreators
// bindActionCreator 的作用就是返回包裹dispatch的函数可以直接使用，用于mapStateToProps中传递多个action

// createAction(s): 生成 action 创建函数，action的type不能使用Symbol类型

// 1.createAction
// const updateAdminUser = createAction(
//     'UPDATE_ADMIN_USER',
//     updates => updates,
//     () => ({ admin: true })
// );
// 等价于​
// updateAdminUser({ name: 'Foo' });
// {
//   type: 'UPDATE_ADMIN_USER',
//   payload: { name: 'Foo' },
//   meta: { admin: true },
// }

// 2.createActions
// const { updateAdminUser } = createActions({
//   UPDATE_ADMIN_USER: [
//     updates => ({ updates }),
//     () => ({ admin: true })
//   ]
// });


// handleAction(s): 生成 reducer

// 1.​handleAction​
// ​handleAction(type, reducer, defaultState)​
// ​handleAction(type, reducerMap, defaultState)​
// 2.​handleActions​
// ​handleActions(reducerMap, defaultState)​

// combineActions: 暂未了解


// redux-thunk
// 通过使用指定的 middleware，action 创建函数除了返回 action 对象外还可以返回函数
// 当 action 创建函数返回函数时，这个函数会被 Redux Thunk middleware 执行