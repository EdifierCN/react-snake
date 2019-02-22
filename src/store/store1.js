import { createActions, handleActions, combineActions } from 'redux-actions';
import undoable, { distinctState } from 'redux-undo'
import { todoActionTypes } from './actionTypes'

let nextTodoId = 0;

// action
export const { addTodo, removeTodo, toggleTodo, setTodoFilter } = createActions({
  [todoActionTypes.ADD]: text => ({
      id: nextTodoId++,
      text
    }),
  [todoActionTypes.REMOVE]: id => ({ id }),
  [todoActionTypes.TOGGLE]: id => ({ id }),
  [todoActionTypes.FILTER]: filter => ({ filter })
});

// defaultState
const defaultState = {
  todos: [],
  todoFilter: 'SHOW_ALL'
};

// case reducer
const handleAddTodo = (state, action) => {
  const todos = state.todos;
  const payload = action.payload;

  return {...state,    todos: [
    ...todos,
    {
      id: payload.id,
      text: payload.text,
      completed: false
    }
  ]}
};

// case reducer
const handleRemoveTodo = (state, action) => {
  const todos = state.todos;
  const payload = action.payload;

  return {...state, todos: todos.filter(todo =>
      todo.id !== payload.id
  )};
};

// case reducer
const handleToggleTodo = (state, action) => {
  const todos = state.todos;
  const payload = action.payload;

  return {...state,   todos: todos.map(todo =>
      (todo.id === payload.id)
          ? {...todo, completed: !todo.completed}
          : todo
  )};
};

// case reducer
const handleSetTodoFilter = (state, action) => {
  const payload = action.payload;

  return {...state, todoFilter: payload.filter};
};

// slice reducer
let reducers = handleActions(
    new Map([
        [
          addTodo,
          handleAddTodo
        ],
        [
          removeTodo,
          handleRemoveTodo
        ],
        [
          toggleTodo,
          handleToggleTodo
        ],
        [
          setTodoFilter,
          handleSetTodoFilter
        ]
    ]),
    defaultState
);

// undoable reducer
reducers = undoable(reducers, {
  filter: distinctState()
});

export { reducers };