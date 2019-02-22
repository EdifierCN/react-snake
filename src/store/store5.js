import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects'

// 1.worker saga
// 做所有的工作，如调用 API，进行异步请求，并且获得返回结果
// 2.watcher saga
// 监听被 dispatch 的 actions，当接收到 action 或者知道其被触发时，调用 worker saga 执行任务
// 3.root saga
// 立即启动 sagas 的唯一入口

// 1.所有的操作放在 saga 中

function* helloSaga() {
  console.log('Hello Sagas!');
}

function* incrementAsync() {
  yield delay(3000);
  yield put({ type: 'INCREMENT' })
}

function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export const rootSaga = function* reducers() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
};

const defaultState = {
  num: 10
};

export const reducers = function (state = defaultState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        num: state.num + 1
      };
    case 'INCREMENT_IF_ODD':
      return {
        num: (state.num  % 2 !== 0) ? state.num  + 1 : state.num
      };
    case 'DECREMENT':
      return {
       num: state.num - 1
      };
    default:
      return state
  }
};



// 辅助函数
// takeEvery 允许多个任务同时启动
// takeLatest 在任何时刻 takeLatest 只允许一个 fetchData 任务在执行。并且这个任务是最后被启动的那个，其他任务被取消。
// call/cps/put

// 错误捕获
// 方式一：
// try {
//   const products = yield call(Api.fetch, '/products')
//   yield put({ type: 'PRODUCTS_RECEIVED', products })
// }
// catch(error) {
//   yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
// }
// 方式二：
// function* fetchProducts() {
//   const { response, error } = yield call(fetchProductsApi)
//   if (response)
//     yield put({ type: 'PRODUCTS_RECEIVED', products: response })
//   else
//     yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
// }

// 流程控制
// 使用take控制流程
// call是阻塞的，在它结束前不能进行其他操作。
// fork 无阻塞调用。
// yield cancel(task)： 取消任务
// yield cancelled()：判断任务是否被取消

// 并发执行
// const [users, repos] = yield [
//   call(fetch, '/users'),
//   call(fetch, '/repos')
// ]
// generator 会被阻塞直到所有的 effects 都执行完毕，或者当一个 effect 被拒绝 （就像 Promise.all 的行为）

// 并发竞赛（获取最先resolve或reject的任务，并会自动取消那些失败的 Effects）
// const {posts, timeout} = yield race({
//   posts: call(fetchApi, '/posts'),
//   timeout: call(delay, 1000)
// })

// Sagas 排序
// yield 的返回值是当作一个元素
// yield* 的返回值是一个 iterator，会依次返回这个 iterator 中的每个元素
// ps: yield* 只允许任务的顺序组合，所以一次你只能 yield* 一个 Generator。

// 取消任务
// 一旦任务被 fork，可以使用 yield cancel(task) 来中止任务执行。取消正在运行的任务
// 自动取消任务：race（一旦某个任务完成，其他都将取消）和 yield [...]（一旦某个被拒绝，其他都将取消）

// 队列
//  action channel：yield actionChannel()
// // 1- 为 REQUEST actions 创建一个 channel
// const requestChan = yield actionChannel('REQUEST')
// while (true) {
//   // 2- take from the channel
//   const {payload} = yield take(requestChan)
//   // 3- 注意这里我们用了一个阻塞调用
//   yield call(handleRequest, payload)
// }
//
// event channel：eventChannel(subscriber)
// const chan = yield call(countdown, value)
// function countdown(secs) {
//   return eventChannel(emitter => {   // 第一个参数为 subscriber 函数
//         const iv = setInterval(() => {
//           secs -= 1
//           if (secs > 0) {
//             emitter(secs)
//           } else {
//             // 这里将导致 channel 关闭
//             emitter(END)
//           }
//         }, 1000);
//         // subscriber 必须回传一个 unsubscribe 函数
//         return () => {
//           clearInterval(iv)
//         }
//       }
//   )
// }
//
// 取消：chan.close()， 关闭 channel 并取消订阅

// put(channel, action)
// 创建一个 Effect 描述信息，用来命令 middleware 向指定的 channel 中放入一条 action。

// take(channel)
// 创建一个 Effect 描述信息，用来命令 middleware 从指定的 Channel 中等待一条特定消息。 如果 channel 已经被关闭，那么 Generator 将以与上面 take(pattern) 所描述一致的步骤马上终止。

// take Effect 是通过等待 action 被发起到 Store 来解决（resolved）的。
// put Effect 是通过发起一个 action 来解决的，action 被作为参数传给 put Effect

// tackEvery
// const takeEvery = (pattern, saga, ...args) => fork(function*() {
//   while (true) {
//     const action = yield take(pattern)
//     yield fork(saga, ...args.concat(action))
//   }
// })

// takeLatest
// const takeLatest = (pattern, saga, ...args) => fork(function*() {
//   let lastTask
//   while (true) {
//     const action = yield take(pattern)
//     if (lastTask) {
//       yield cancel(lastTask) // 如果任务已经结束，则 cancel 为空操作
//     }
//     lastTask = yield fork(saga, ...args.concat(action))
//   }
// })

// 登录流程控制:
// function* authorize(user, password) {
//   try {
//     const token = yield call(Api.authorize, user, password)
//     yield put({type: 'LOGIN_SUCCESS', token})
//     yield call(Api.storeItem, {token})
//     return token
//   } catch(error) {
//     yield put({type: 'LOGIN_ERROR', error})
//   } finally {
//     if (yield cancelled()) {
//       // ... put special cancellation handling code here
//     }
//   }
// }

// function* loginFlow() {
//   while(true) {
//     const {user, password} = yield take('LOGIN_REQUEST')
//     // fork return a Task object
//     const task = yield fork(authorize, user, password)     //使用fork，以防止丢失登入过程中，用户执行的loginout
//     const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
//     if(action.type === 'LOGOUT')
//       yield cancel(task)
//     yield call(Api.clearItem('token'))
//   }
// }