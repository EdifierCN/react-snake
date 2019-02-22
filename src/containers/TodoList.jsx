import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { toggleTodo, removeTodo } from '../store/store1'
import TodoList from '../components/TodoList'

const getVisibilityFilter = (state, params) => params.filter;
const getTodos = (state, params) => state.todos;

// 用 createSelector 创建的 selector 只有在参数集与之前的参数集相同时才会返回缓存的值
// 使用函数形式创建私有selector
const makeGetVisibleTodos = () => {
  return createSelector(
      [ getVisibilityFilter, getTodos ],    //  input-selector
      (filter, todos) => {    // 转换函数，接收 input-selector 作为参数
        switch (filter) {
          case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
          case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
          default: return todos
        }
      }
  );
};

const makeMapStateToProps = () => {
  const getVisibleTodos = makeGetVisibleTodos();
  return ({store1: store}, {location: {state}}) => {
    return {
      todos: getVisibleTodos(store.present, state||{filter:'SHOW_ALL'})
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => dispatch(toggleTodo(id)),
    onTodoRemove: id => dispatch(removeTodo(id))
  }
};

const VisibleTodoList = connect(
    makeMapStateToProps,
    mapDispatchToProps
)(TodoList);

export default withRouter(VisibleTodoList)