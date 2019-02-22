import fetch from 'cross-fetch'
import { createActions, handleActions, combineActions } from 'redux-actions';
import { subredditTypes } from './actionTypes'

// 同步 action
export const { selectSubreddit, invalidateSubreddit, requestPosts, receivePosts } = createActions({
  [subredditTypes.SELECT]: subreddit => ({
    subreddit
  }),
  [subredditTypes.INVALIDATE]: subreddit => ({
    subreddit
  }),
  [subredditTypes.REQUEST]: subreddit => ({
    subreddit
  }),
  [subredditTypes.RECEIVE]: (subreddit, json) => ({
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  })
});

// 异步 action 使用redux-thunk，必须是thunk函数(返回函数的函数)
export function fetchPosts(subreddit){
  return function (dispath) {
    dispath(requestPosts(subreddit));

    return fetch(`http://www.subreddit.com/r/${subreddit}.json`)
        .then(
            response => response.json(),
            error => console.log('An error occurred.', error)
        )
        .then(
            json => {
              dispath(receivePosts(subreddit, json))
            }
        )
  }
}
function shouldFetchPosts(state, subreddit) {
  const store = state.store2;
  const posts = store.postsBySubreddit[subreddit];

  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}
export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    } else {
      return Promise.resolve()
    }
  }
}

// defaultState
const defaultState = {
  selectedsubreddit: 'frontend',
  entities: {
    users: {
      2: {
        id: 2,
        name: 'Andrew'
      }
    },
    posts: {
      42: {
        id: 42,
        title: 'Confusion about Flux and Relay',
        author: 2
      },
      100: {
        id: 100,
        title: 'Creating a Simple Application Using React JS and Flux Architecture',
        author: 2
      }
    }
  },
  postsBySubreddit: {
    frontend: {
      isFetching: true, // 显示进度条
      didInvalidate: false, // 标记数据是否过期
      items: [],
      fetchedPageCount: 0
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,  // 数据最后更新时间
      items: [ 42, 100 ],
      fetchedPageCount: 0
    }
  }
};

// case reducer
const handleSelectSubreddit =  (state, action) => {
  const payload = action.payload;

  return {...state,
    selectedsubreddit: payload.subreddit
  }
};

// case reducer
const handleInvalidateSubreddit = (state, action) => {
  const postsBySubreddit = state.postsBySubreddit;
  const payload = action.payload;
  const selectedsubreddit = payload.subreddit;

  return {
    ...state,
    postsBySubreddit: {
      ...postsBySubreddit,
      [selectedsubreddit]: {
        ...postsBySubreddit[selectedsubreddit],
        didInvalidate: true
      }
    }
  }
};

// case reducer
const handleRequestPosts = (state, action) => {
  const postsBySubreddit = state.postsBySubreddit;
  const payload = action.payload;
  const selectedsubreddit = payload.subreddit;

  return {
    ...state,
    postsBySubreddit: {
      ...postsBySubreddit,
      [selectedsubreddit]: {
        ...postsBySubreddit[selectedsubreddit],
        isFetching: true,
        didInvalidate: false
      }
    }
  };
};

// case reducer
const handleReceivePosts = (state, action) => {
  const postsBySubreddit = state.postsBySubreddit;
  const payload = action.payload;
  const selectedsubreddit = payload.subreddit;
  const posts = payload.posts;

  let postsObj = {};
  let usersObj = {};
  posts.forEach(item => {
    postsObj[item.id] = item;
    usersObj[item.author] = {
      id: item.author,
      name: item.name
    }
  });

  return {
    ...state,
    entities: {
      users: usersObj,
      posts: postsObj
    },
    postsBySubreddit: {
      ...postsBySubreddit,
      [selectedsubreddit]: {
        ...postsBySubreddit[selectedsubreddit],
        id: posts[0].subreddit_id,
        isFetching: false,
        didInvalidate: false,
        items: posts.map(item => (item.id)),
        lastUpdated: payload.receivedAt
      }
    }
  };
};

// slice reducer
export const reducers = handleActions(
    new Map([
        [
          selectSubreddit,
          handleSelectSubreddit
        ],
        [
          invalidateSubreddit,
          handleInvalidateSubreddit
        ],
        [
          requestPosts,
          handleRequestPosts
        ],
        [
          receivePosts,
          handleReceivePosts
        ]
    ]),
    defaultState
);