import { Model, many, fk, ORM, createReducer, attr } from "redux-orm";
import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects'
import { createActions, handleActions, combineActions } from 'redux-actions';
import getUUID from 'uuid/v1'
import { postTypes } from './actionTypes'

export const { createPost, addComment } = createActions({
  [postTypes.CREATE]: post => ({
      ...post
  }),
  [postTypes.ADD_COMMENT]: comment => ({
      ...comment
  })
});

function* addPostAsync() {
  yield delay(3000);
  yield put(createPost({
    postId: 5,
    userId: 1,
    userName: 'Jack',
    title: 'posts_5',
    content: 'posts_5_content'
  }));
}

function* watchAddPostAsync() {
  yield takeEvery(postTypes.REQUEST, addPostAsync)
}

export const rootSaga = function* () {
  yield all([
    watchAddPostAsync()
  ])
};

export class User extends Model {
  static modelName = 'User';

  static get fields(){
    return {
      uuid: attr({ getDefault: () => getUUID() }),
      id: attr(),
      name: attr(),
    }
  }

  static reducer(action, User, session){

    switch(action.type) {
      case postTypes.CREATE : {
        const {payload:{userId, userName}} = action;

        User.upsert({id: userId, name: userName});
        break;
      }
      case postTypes.ADD_COMMENT : {
        const {payload:{userId, userName}} = action;

        User.upsert({id: userId, name: userName});

        break;
      }
    }
  }
}

export class Post extends Model {
  static modelName = 'Post';

  static get fields(){
    return {
      uuid: attr({ getDefault: () => getUUID() }),
      userId: fk('User', 'posts'),
      postId: attr(),
      title: attr(),
      content: attr(),
    }
  }

  static options = {
    idAttribute: 'postId',
  };

  static reducer(action, Post, session){
    switch(action.type){
      case postTypes.CREATE:{
        const { payload:{ postId, userId, title, content } } = action;

        Post.upsert({
          postId,
          userId,
          title,
          content
        });
        break;
      }
    }
  }
 }

export class Comment extends Model {
  static modelName = 'Comment';

  static get fields() {
    return {
      uuid: attr({ getDefault: () => getUUID() }),
      commentId: fk('Post', 'comments'),
      userId: fk('User', 'comments'),
      postId: attr(),
      content: attr(),
    };
  }

  static options = {
    idAttribute: 'commentId',
  };

  static reducer(action, Comment, session) {
    switch(action.type) {
      case postTypes.ADD_COMMENT : {
        const {payload:{commentId, postId, userId, content}} = action;

        Comment.upsert({
          commentId,
          postId,
          userId,
          content,
        });
        break;
      }
    }
  }
}

// 创建 Schema 实例，然后和 Post、Comment 数据模型挂钩起来
const orm  = new ORM();
orm .register(User, Post, Comment);

export const reducers = createReducer(orm);


// 基本使用：
// const emptyDBState = orm.getEmptyState();  // 生成一个空的数据库状态
// console.info(emptyDBState);

// const users = [{
//   id: 1,
//   name: 'Dom',
// },{
//   id: 2,
//   name: 'Jack',
// },{
//   id: 3,
//   name: 'Tom',
// }];
//
// const posts = [{
//   postId: 1,
//   userId: 1,
//   title: 'posts_1',
//   content: 'posts_1_content',
// },{
//   postId: 2,
//   userId: 3,
//   title: 'posts_2',
//   content: 'posts_2_content',
// }];
//
// const comments = [{
//   commentId: 1,
//   postId: 1,
//   userId: 1,
//   content: 'posts_1_comment_content_1',
// },{
//   commentId: 2,
//   postId: 1,
//   userId: 3,
//   content: 'posts_1_comment_content_2',
// }];

// 对于初始状态设置，貌似没啥好的方法，只能通过遍历提交

// const session = orm.session(emptyDBState);  // 使用orm.session来应用更新，返回session实例
// const Post = session.Post;    // 已注册模型作为会话的属性
// const updatedDBState = session.state;    // 获取更新后的state


// fields：声明关系的类型
// fk （toModelNameOrObj，relatedName opt）→ {ForeignKey}：多对一。
// 在模型上定义一个外键，指向另一个模型上的单个实体
// 定义外键。FK设定的重要原则：FK必然是另一个表的PK的映射。（做FK的不一定是PK字段）
// console.info('从post到user的正向关系：', Post.withId(1).userId.name);
// console.info(Post.all().toRefArray());    // 查询集方法可通过类访问
// console.info('从user到post的反向关系：',User.withId(1).posts.toRefArray());

// oneToOne(toModelNameOrObj, relatedNameopt) → {OneToOne}: 一对一
// 定义此（源）和另一个（目标）模型之间的多对多关系。

// many(options) → {ManyToMany}: 多对多
// 定义一对一的关系。在数据库方面，这是一个外键，增加了限制，只有一个实体可以指向单个目标实体。


// model的reducer的定义方式：
// 1.通过reducer在model类添加静态方法,该方法接受第一个参数为动作，第二个为特定于会话的Model，第三个为整个会话。
// 2.单独定义reducer，参数为dbState， action，将orm导入，通过orm.session(dbState)获取当前session，返回session.state

// function createReducer(orm, updater = defaultUpdater) {
//   return (state, action) => {
//     const session = orm.session(state || orm.getEmptyState());
//     updater(session, action);
//     return session.state;
//   };
// }

// function defaultUpdater(session, action) {
//   session.sessionBoundModels.forEach(modelClass => {
//     if (typeof modelClass.reducer === 'function') {
//       modelClass.reducer(action, modelClass, session);
//     }
//   });
// }