// 不同 reducers 之间共享数据 demo

// const defaultState = {
//   a: 1,
//   b: 2,
// };

// 方式一：参数传递
// export const reducers = (state = defaultState, action) => {
//   switch(action.type) {
//     case "A_TYPICAL_ACTION" : {
//       return {
//         a : sliceReducerA(state.a, action),
//         b : sliceReducerB(state.b, action)
//       };
//     }
//     case "SOME_SPECIAL_ACTION" : {
//       return {
//         // 明确地把 state.b 作为额外参数进行传递
//         a : sliceReducerA(state.a, action, state.b),
//         b : sliceReducerB(state.b, action)
//       }
//     }
//     case "ANOTHER_SPECIAL_ACTION" : {
//       return {
//         a : sliceReducerA(state.a, action),
//         // 明确地把全部的 state 作为额外参数进行传递
//         b : sliceReducerB(state.b, action, state)
//       }
//     }
//     default: return state;
//   }
// };

// 方式二：thunk函数插入
// function someSpecialActionCreator() {
//   return (dispatch, getState) => {
//     const state = getState();
//     const dataFromB = selectImportantDataFromB(state);
//
//     dispatch({
//       type : "SOME_SPECIAL_ACTION",
//       payload : {
//         dataFromB
//       }
//     });
//   }
// }

// 方式：
// const combinedReducer = combineReducers({
//   a : sliceReducerA,
//   b : sliceReducerB
// });
//
// function crossSliceReducer(state, action) {
//   switch(action.type) {
//     case "SOME_SPECIAL_ACTION" : {
//       return {
//         // 明确地把 state.b 作为额外参数进行传递
//         a : handleSpecialCaseForA(state.a, action, state.b),
//         b : sliceReducerB(state.b, action)
//       }
//     }
//     default : return state;
//   }
// }
//
// function rootReducer(state, action) {
//   const intermediateState = combinedReducer(state, action);
//   const finalState = crossSliceReducer(intermediateState, action);
//   return finalState;
// }

// 数据范式化
const state_standard = {
  posts : {
    byId : {
      "post1" : {
        id : "post1",
        author : "user1",
        body : "......",
        comments : ["comment1", "comment2"]
      },
      "post2" : {
        id : "post2",
        author : "user2",
        body : "......",
        comments : ["comment3", "comment4", "comment5"]
      }
    },
    allIds : ["post1", "post2"]
  },
  comments : {
    byId : {
      "comment1" : {
        id : "comment1",
        author : "user2",
        comment : ".....",
      },
      "comment2" : {
        id : "comment2",
        author : "user3",
        comment : ".....",
      },
      "comment3" : {
        id : "comment3",
        author : "user3",
        comment : ".....",
      },
      "comment4" : {
        id : "comment4",
        author : "user1",
        comment : ".....",
      },
      "comment5" : {
        id : "comment5",
        author : "user3",
        comment : ".....",
      },
    },
    allIds : ["comment1", "comment2", "comment3", "commment4", "comment5"]
  },
  users : {
    byId : {
      "user1" : {
        username : "user1",
        name : "User 1",
      },
      "user2" : {
        username : "user2",
        name : "User 2",
      },
      "user3" : {
        username : "user3",
        name : "User 3",
      }
    },
    allIds : ["user1", "user2", "user3"]
  }
};